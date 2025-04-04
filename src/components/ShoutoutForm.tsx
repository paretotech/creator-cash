import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  Paper, Container, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, SelectChangeEvent, Divider
} from '@mui/material';
import { Creator, ShoutoutOption } from '../types';
import { formatCurrency } from '../services/paymentService';
import { processPayment } from '../services/paymentService';
import { bookShoutout } from '../services/mockData';

interface ShoutoutFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const ShoutoutForm: React.FC<ShoutoutFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOptionChange = (event: SelectChangeEvent<string>) => {
    setSelectedOptionId(event.target.value);
  };

  const selectedOption = creator.shoutoutOptions.find(option => option.id === selectedOptionId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedOptionId || !details) {
      setError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Process payment first
      const paymentResult = await processPayment(selectedOption?.price || 0);
      
      if (paymentResult.success) {
        // If payment succeeded, book the shoutout
        bookShoutout(
          creator.username, 
          name, 
          email, 
          selectedOptionId, 
          details
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

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Get a Shoutout from {creator.name}
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your shoutout request has been submitted successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for your request. {creator.name} will review your shoutout details and deliver it within the specified timeframe.
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
              Select a Shoutout Option
            </Typography>
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="shoutout-option-label">Shoutout Type</InputLabel>
              <Select
                labelId="shoutout-option-label"
                value={selectedOptionId}
                label="Shoutout Type"
                onChange={handleOptionChange}
              >
                {creator.shoutoutOptions.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.title} - {formatCurrency(option.price)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedOption && (
              <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedOption.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedOption.description}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">
                      <strong>Delivery time:</strong> {selectedOption.deliveryTime}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(selectedOption.price)}
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
            />
            
            <TextField
              label="Shoutout Details"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              required
              placeholder="Please provide all details needed for your shoutout, like what you want them to say, any specific points to mention, etc."
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
                disabled={loading || !selectedOptionId}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit & Pay'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ShoutoutForm;
