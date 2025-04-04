import React, { useState } from 'react';
import { 
  Container, Paper, Typography, Box, FormControlLabel, Grid,
  Switch, Button, Alert, Divider, CircularProgress, Snackbar,
  Card, CardContent, CardActions, TextField, MenuItem, Select,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, SelectChangeEvent, InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Creator } from '../types';
import type { CreatorSettings, QuestionResponseOption } from '../types';
import { updateCreatorSettings } from '../services/mockData';
import { v4 as uuidv4 } from 'uuid';

interface CreatorSettingsProps {
  creator: Creator;
  onSettingsUpdated: (updatedCreator: Creator) => void;
}

const CreatorSettingsForm: React.FC<CreatorSettingsProps> = ({ creator, onSettingsUpdated }) => {
  const [settings, setSettings] = useState<CreatorSettings>(creator.settings);
  const [questionOptions, setQuestionOptions] = useState<QuestionResponseOption[]>(creator.questionResponseOptions);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOptionDialog, setShowOptionDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<QuestionResponseOption | null>(null);
  const [newOption, setNewOption] = useState<QuestionResponseOption>({
    id: '',
    type: 'text',
    title: '',
    description: '',
    price: 0,
    estimatedResponseTime: ''
  });

  const handleToggleChange = (settingName: keyof CreatorSettings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: event.target.checked
    }));
  };

  // Question response option handlers
  const handleAddOption = () => {
    setEditingOption(null);
    setNewOption({
      id: '',
      type: 'text',
      title: '',
      description: '',
      price: 0,
      estimatedResponseTime: ''
    });
    setShowOptionDialog(true);
  };

  const handleEditOption = (option: QuestionResponseOption) => {
    setEditingOption(option);
    setNewOption({ ...option });
    setShowOptionDialog(true);
  };

  const handleDeleteOption = (optionId: string) => {
    setQuestionOptions(prev => prev.filter(opt => opt.id !== optionId));
  };

  const handleOptionDialogClose = () => {
    setShowOptionDialog(false);
  };

  const handleOptionTypeChange = (event: SelectChangeEvent) => {
    setNewOption(prev => ({
      ...prev,
      type: event.target.value as 'text' | 'video' | 'audio'
    }));
  };

  const handleOptionSave = () => {
    // Validate option data
    if (!newOption.title || !newOption.description || newOption.price <= 0 || !newOption.estimatedResponseTime) {
      setError('Please fill in all response option fields with valid values');
      return;
    }

    if (editingOption) {
      // Update existing option
      setQuestionOptions(prev => 
        prev.map(opt => opt.id === editingOption.id ? { ...newOption } : opt)
      );
    } else {
      // Add new option with generated ID
      setQuestionOptions(prev => [...prev, { ...newOption, id: `qro-${Date.now()}` }]);
    }

    setShowOptionDialog(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Simulate a brief delay for the API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Create a modified version of the creator with updated settings and options
      const modifiedCreator = {
        ...creator,
        settings,
        questionResponseOptions: questionOptions
      };
      
      // Mock update for the API call - in a real app, we would pass questionOptions in the API call
      // For now, we manually set them in the creator object after updating settings
      const updatedCreator = updateCreatorSettings(creator.username, settings);
      
      // If update succeeded, manually update questionResponseOptions in the creator
      if (updatedCreator) {
        updatedCreator.questionResponseOptions = questionOptions;
      }
      
      if (updatedCreator) {
        onSettingsUpdated(updatedCreator);
        setSuccess(true);
      } else {
        setError('Failed to update settings. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Profile Settings
        </Typography>
        
        <Typography variant="body1" color="text.secondary" paragraph>
          Control which monetization features appear on your profile page. Toggle buttons on or off to show or hide them.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            Feature Visibility
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Control which monetization options are visible on your profile.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableQuestions}
                  onChange={handleToggleChange('enableQuestions')}
                  color="primary"
                />
              }
              label="Ask Me a Question"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableCalls}
                  onChange={handleToggleChange('enableCalls')}
                  color="secondary"
                />
              }
              label="Book a Call"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableProducts}
                  onChange={handleToggleChange('enableProducts')}
                  color="success"
                />
              }
              label="Buy My Stuff"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableShoutouts}
                  onChange={handleToggleChange('enableShoutouts')}
                  color="info"
                />
              }
              label="Get A Shoutout"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableHiring}
                  onChange={handleToggleChange('enableHiring')}
                  color="warning"
                />
              }
              label="Hire Me"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enablePrivateGroups}
                  onChange={handleToggleChange('enablePrivateGroups')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9c27b0',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#9c27b0',
                    },
                  }}
                />
              }
              label="Join Private Group"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableTips}
                  onChange={handleToggleChange('enableTips')}
                />
              }
              label="Send a Tip"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableWaitlist}
                  onChange={handleToggleChange('enableWaitlist')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#ff5722',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 87, 34, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#ff5722',
                    },
                  }}
                />
              }
              label="Join Waitlist"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.enableFavorites}
                  onChange={handleToggleChange('enableFavorites')}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#9c27b0',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.08)',
                      },
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#9c27b0',
                    },
                  }}
                />
              }
              label="My Favorites"
            />
          </Box>
        </Box>
        
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Question Response Options
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Configure the types of responses you offer when followers ask you questions.
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
            {questionOptions.map((option) => (
              <Box key={option.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {option.title}
                      </Typography>
                      <Typography variant="subtitle1" color="primary" fontWeight="bold">
                        ${option.price.toFixed(2)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {option.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                        Type:
                      </Typography>
                      <Typography variant="body2">
                        {option.type.charAt(0).toUpperCase() + option.type.slice(1)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      Response time: {option.estimatedResponseTime}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton size="small" onClick={() => handleEditOption(option)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteOption(option.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </CardActions>
                </Card>
              </Box>
            ))}
            <Box>
              <Card 
                variant="outlined" 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  minHeight: '200px',
                  cursor: 'pointer',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
                }}
                onClick={handleAddOption}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <AddIcon fontSize="large" color="primary" sx={{ mb: 1 }} />
                  <Typography color="primary">
                    Add Response Option
                  </Typography>
                </Box>
              </Card>
            </Box>
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} /> : null}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </Box>

          {/* Option Dialog */}
          <Dialog open={showOptionDialog} onClose={handleOptionDialogClose} fullWidth maxWidth="sm">
            <DialogTitle>{editingOption ? 'Edit Response Option' : 'Add Response Option'}</DialogTitle>
            <DialogContent>
              <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={newOption.title}
                onChange={(e) => setNewOption({ ...newOption, title: e.target.value })}
                placeholder="e.g., Text Response, Video Response"
                required
              />
              
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                value={newOption.description}
                onChange={(e) => setNewOption({ ...newOption, description: e.target.value })}
                placeholder="Describe what followers will receive"
                multiline
                rows={2}
                required
              />
              
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="response-type-label">Response Type</InputLabel>
                  <Select
                    labelId="response-type-label"
                    value={newOption.type}
                    label="Response Type"
                    onChange={handleOptionTypeChange}
                    required
                  >
                    <MenuItem value="text">Text</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Price"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={newOption.price}
                  onChange={(e) => setNewOption({ ...newOption, price: parseFloat(e.target.value) || 0 })}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                  required
                />
              </Box>
              
              <TextField
                label="Estimated Response Time"
                fullWidth
                margin="normal"
                value={newOption.estimatedResponseTime}
                onChange={(e) => setNewOption({ ...newOption, estimatedResponseTime: e.target.value })}
                placeholder="e.g., 24 hours, 2-3 days"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOptionDialogClose}>Cancel</Button>
              <Button onClick={handleOptionSave} variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Paper>
      
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Settings updated successfully"
      />
    </Container>
  );
};

export default CreatorSettingsForm;
