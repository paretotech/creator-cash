import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  Paper, Container, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel,
  Card, CardContent, SelectChangeEvent, Divider
} from '@mui/material';
import { Creator, HireService } from '../types';
import { formatCurrency } from '../services/paymentService';
import { processPayment } from '../services/paymentService';
import { bookHireService } from '../services/mockData';

interface HireServiceFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const HireServiceForm: React.FC<HireServiceFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [projectDetails, setProjectDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleServiceChange = (event: SelectChangeEvent<string>) => {
    setSelectedServiceId(event.target.value);
  };

  const selectedService = creator.hireServices.find(service => service.id === selectedServiceId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !selectedServiceId || !projectDetails) {
      setError('Please fill out all required fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Process payment first
      const paymentResult = await processPayment(selectedService?.price || 0);
      
      if (paymentResult.success) {
        // If payment succeeded, book the service
        bookHireService(
          creator.username, 
          name, 
          email, 
          selectedServiceId, 
          projectDetails
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
          Hire {creator.name}
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your service request has been submitted successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for your request. {creator.name} will review your project details and get back to you shortly 
              to discuss next steps.
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
              Select a Service
            </Typography>
            
            <FormControl fullWidth margin="normal" required>
              <InputLabel id="service-option-label">Service Type</InputLabel>
              <Select
                labelId="service-option-label"
                value={selectedServiceId}
                label="Service Type"
                onChange={handleServiceChange}
              >
                {creator.hireServices.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.title} - {formatCurrency(service.price)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {selectedService && (
              <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {selectedService.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedService.description}
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">
                      <strong>Estimated time:</strong> {selectedService.timeEstimate}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {formatCurrency(selectedService.price)}
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
              label="Project Details"
              multiline
              rows={6}
              fullWidth
              margin="normal"
              value={projectDetails}
              onChange={(e) => setProjectDetails(e.target.value)}
              required
              placeholder="Please provide detailed information about your project, including your goals, requirements, timeline, and any other relevant details that will help the creator understand your needs."
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
                disabled={loading || !selectedServiceId}
              >
                {loading ? <CircularProgress size={24} /> : 'Submit & Pay Deposit'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default HireServiceForm;
