import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  Paper, Container, CircularProgress, Alert,
  InputAdornment
} from '@mui/material';
import { Creator } from '../types';
import { formatCurrency } from '../services/paymentService';
import { sendTip } from '../services/mockData';
import PaymentModal from './PaymentModal';

interface TipFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const TipForm: React.FC<TipFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  const validateForm = () => {
    if (!name || amount < 1) {
      setError('Please provide your name and an amount of at least $1');
      return false;
    }

    setError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setFormValidated(true);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setLoading(true);
    
    try {
      // Record the tip after payment succeeded
      sendTip(creator.username, name, message, amount);
      setSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        onSuccess();
      }, 1000);
    } catch (err) {
      setError('Your payment was processed, but there was an error recording your tip. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(`Payment failed: ${errorMessage}`);
    setShowPaymentModal(false);
  };

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Send a Tip to {creator.name}
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your tip has been sent successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for supporting {creator.name}!
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
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
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value)))}
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{
                min: 1,
                step: 1
              }}
            />
            
            <TextField
              label="Message (Optional)"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a supportive message..."
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
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Continue to Payment'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      {/* Payment Modal */}
      {formValidated && (
        <PaymentModal 
          open={showPaymentModal}
          onClose={handlePaymentModalClose}
          amount={amount}
          itemName={`Tip for ${creator.name}`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </Container>
  );
};

export default TipForm;
