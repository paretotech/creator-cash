import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  Paper, Container, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, SelectChangeEvent, Divider, Chip, Stack
} from '@mui/material';
import { Creator, PrivateGroup } from '../types';
import { formatCurrency } from '../services/paymentService';
import { processPayment } from '../services/paymentService';
import { joinPrivateGroup } from '../services/mockData';

interface PrivateGroupFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const PrivateGroupForm: React.FC<PrivateGroupFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleGroupChange = (event: SelectChangeEvent<string>) => {
    setSelectedGroupId(event.target.value);
  };

  const selectedGroup = creator.privateGroups.find(group => group.id === selectedGroupId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedGroupId) {
      setError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Process payment first
      const paymentResult = await processPayment(selectedGroup?.membershipFee || 0);
      
      if (paymentResult.success) {
        // If payment succeeded, join the private group
        joinPrivateGroup(
          creator.username, 
          name, 
          email, 
          selectedGroupId
        );
        setSuccess(true);
        setTimeout(onSuccess, 2000);
      } else {
        setError(paymentResult.error || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getBillingLabel = (group: PrivateGroup) => {
    return `${formatCurrency(group.membershipFee)} / ${group.billingCycle}`;
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Join {creator.name}'s Private Group
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              You've successfully joined the private group!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for joining! {creator.name} will reach out with access details and 
              next steps for getting started. Check your email for more information.
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Select a Group
            </Typography>
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="group-select-label">Private Group</InputLabel>
              <Select
                labelId="group-select-label"
                value={selectedGroupId}
                label="Private Group"
                onChange={handleGroupChange}
              >
                {creator.privateGroups.map((group) => (
                  <MenuItem key={group.id} value={group.id}>
                    {group.name} - {getBillingLabel(group)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedGroup && (
              <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedGroup.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedGroup.description}
                  </Typography>
                  
                  <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                    Benefits include:
                  </Typography>
                  
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {selectedGroup.benefits.map((benefit, index) => (
                      <Chip 
                        key={index} 
                        label={benefit} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                        sx={{ my: 0.5 }}
                      />
                    ))}
                  </Stack>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2">
                      <strong>Billing:</strong> {selectedGroup.billingCycle}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(selectedGroup.membershipFee)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Your Information
            </Typography>
            
            <TextField
              label="Your Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            
            <TextField
              label="Your Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              helperText="You'll receive access instructions at this email"
            />
            
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button 
                variant="outlined" 
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disabled={loading || !selectedGroupId}
              >
                {loading ? <CircularProgress size={24} /> : `Join & Pay ${selectedGroup ? formatCurrency(selectedGroup.membershipFee) : ''}`}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default PrivateGroupForm;
