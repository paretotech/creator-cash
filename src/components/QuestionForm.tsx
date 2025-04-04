import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button,
  Paper, Container, CircularProgress, Alert,
  RadioGroup, FormControlLabel, Radio, Card, CardContent,
  Divider
} from '@mui/material';
import { Creator } from '../types';
import { formatCurrency } from '../services/paymentService';
import { askQuestion } from '../services/mockData';
import PaymentModal from './PaymentModal';

interface QuestionFormProps {
  creator: Creator;
  onSuccess: () => void;
  onCancel: () => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ creator, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    creator.questionResponseOptions.length > 0 ? creator.questionResponseOptions[0].id : ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  const handleResponseOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOptionId(event.target.value);
  };
  
  const selectedOption = creator.questionResponseOptions.find(option => option.id === selectedOptionId);

  const validateForm = () => {
    if (!name || !email || !question || !selectedOptionId) {
      setError('Please fill out all required fields and select a response option');
      return false;
    }

    if (!selectedOption) {
      setError('Please select a valid response option');
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
      // Create the question after payment succeeded
      askQuestion(creator.username, name, email, question, selectedOption!.price, selectedOption!.id, selectedOption!.type);
      setSuccess(true);
      setTimeout(() => {
        setShowPaymentModal(false);
        onSuccess();
      }, 1000);
    } catch (err) {
      setError('Your payment was processed, but there was an error submitting your question. Please contact support.');
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
          Ask {creator.name} a Question
        </Typography>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your question has been submitted successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              Thank you for your question. {creator.name} will respond to you soon.
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
            
            <TextField
              label="Your Question"
              multiline
              rows={4}
              fullWidth
              margin="normal"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              placeholder="What would you like to ask?"
            />
            
            <Box mt={3}>
              <Typography variant="h6" gutterBottom>
                Select Response Type
              </Typography>
              <RadioGroup
                value={selectedOptionId}
                onChange={handleResponseOptionChange}
              >
                {creator.questionResponseOptions.map((option) => (
                  <Card 
                    key={option.id} 
                    variant="outlined" 
                    sx={{ 
                      mb: 2, 
                      border: selectedOptionId === option.id ? '2px solid #5271ff' : '1px solid rgba(0, 0, 0, 0.12)' 
                    }}
                  >
                    <CardContent sx={{ '&:last-child': { pb: 2 } }}>
                      <FormControlLabel
                        value={option.id}
                        control={<Radio />}
                        label={
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {option.title} - {formatCurrency(option.price)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {option.description}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2">
                              Estimated response time: {option.estimatedResponseTime}
                            </Typography>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%', alignItems: 'flex-start' }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </RadioGroup>
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
                {loading ? <CircularProgress size={24} /> : 'Continue to Payment'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>

      {/* Payment Modal */}
      {formValidated && selectedOption && (
        <PaymentModal 
          open={showPaymentModal}
          onClose={handlePaymentModalClose}
          amount={selectedOption.price}
          itemName={`Question for ${creator.name} (${selectedOption.title})`}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      )}
    </Container>
  );
};

export default QuestionForm;
