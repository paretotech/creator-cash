import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Container, 
  CircularProgress, 
  Alert,
  Divider
} from '@mui/material';
import { Creator } from '../types';
import { joinWaitlist } from '../services/mockData';

interface WaitlistFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const WaitlistForm: React.FC<WaitlistFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Validate form
  const validateForm = () => {
    if (!name || !email) {
      setError('Please provide your name and email address');
      return false;
    }

    setError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Join the waitlist
      const result = joinWaitlist(
        creator.username,
        name,
        email,
        undefined,
        creator.waitlistConfig?.interestCategories || [],
        phone ? 'both' : 'email',
        phone
      );
      
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError('Failed to join the waitlist. Please try again later.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Join {creator.name}'s Waitlist
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              You've been added to the waitlist!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for joining {creator.name}'s waitlist. You'll be notified when a spot becomes available.
            </Typography>
            {creator.waitlistConfig?.estimatedWaitTime && (
              <Typography variant="body2" color="text.secondary">
                Estimated wait time: {creator.waitlistConfig.estimatedWaitTime}
              </Typography>
            )}
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            {creator.waitlistConfig?.description && (
              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                {creator.waitlistConfig.description}
              </Typography>
            )}
            
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
              label="Phone Number (Optional)"
              fullWidth
              margin="normal"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Your contact number"
            />
            
            <Divider sx={{ my: 3 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              We'll notify you when a spot becomes available. Your information will only be used for waitlist communications.
            </Typography>
            
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Join Waitlist'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default WaitlistForm;
