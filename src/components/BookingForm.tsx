import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Slider, 
  Paper, Container, CircularProgress, Alert,
  FormControl, InputLabel, MenuItem, Select, 
  SelectChangeEvent, Chip
} from '@mui/material';
import { Creator } from '../types';
import { formatCurrency } from '../services/paymentService';
import { bookCall } from '../services/mockData';
import PaymentModal from './PaymentModal';

interface BookingFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const durationOptions = [15, 30, 45, 60];

const BookingForm: React.FC<BookingFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [amount, setAmount] = useState(creator.callPrice.min);
  const [preferredDates, setPreferredDates] = useState<string[]>([]);
  const [newDate, setNewDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  const handleAmountChange = (_event: Event, newValue: number | number[]) => {
    setAmount(newValue as number);
  };

  const handleDurationChange = (event: SelectChangeEvent<number>) => {
    setDuration(event.target.value as number);
  };

  const handleAddDate = () => {
    if (newDate && !preferredDates.includes(newDate)) {
      setPreferredDates([...preferredDates, newDate]);
      setNewDate('');
    }
  };

  const handleRemoveDate = (dateToRemove: string) => {
    setPreferredDates(preferredDates.filter(date => date !== dateToRemove));
  };

  const validateForm = () => {
    if (!name || !email || preferredDates.length === 0) {
      setError('Please fill out all required fields and add at least one preferred date');
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
      // Create the booking after payment succeeded
      bookCall(creator.username, name, email, duration, preferredDates, notes, amount);
      setSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        onSuccess();
      }, 1000);
    } catch (err) {
      setError('Your payment was processed, but there was an error submitting your booking. Please contact support.');
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
          Book a Call with {creator.name}
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your booking request has been submitted successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for booking a call. {creator.name} will contact you soon to confirm the details.
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
              label="Your Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="duration-select-label">Call Duration</InputLabel>
              <Select
                labelId="duration-select-label"
                value={duration}
                label="Call Duration"
                onChange={handleDurationChange}
              >
                {durationOptions.map(option => (
                  <MenuItem key={option} value={option}>
                    {option} minutes
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Box mt={3}>
              <Typography gutterBottom>Preferred Dates and Times:</Typography>
              <Box display="flex" gap={1} mb={1}>
                <TextField
                  label="Add Date/Time"
                  placeholder="e.g., April 1st, 2pm EST"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  fullWidth
                />
                <Button variant="outlined" onClick={handleAddDate}>
                  Add
                </Button>
              </Box>
              
              <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                {preferredDates.map((date, index) => (
                  <Chip 
                    key={index} 
                    label={date} 
                    onDelete={() => handleRemoveDate(date)} 
                  />
                ))}
              </Box>
            </Box>
            
            <TextField
              label="Notes or Special Requests"
              multiline
              rows={3}
              fullWidth
              margin="normal"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any topics you'd like to discuss or other information"
            />
            
            <Box mt={3}>
              <Typography gutterBottom>
                Amount: {formatCurrency(amount)}
              </Typography>
              <Slider
                value={amount}
                onChange={handleAmountChange}
                min={creator.callPrice.min}
                max={creator.callPrice.max}
                step={25}
                marks
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => formatCurrency(value)}
              />
            </Box>
            
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
                {loading ? <CircularProgress size={24} /> : 'Book & Pay'}
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
          itemName={`${duration} Minute Call with ${creator.name}`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </Container>
  );
};

export default BookingForm;
