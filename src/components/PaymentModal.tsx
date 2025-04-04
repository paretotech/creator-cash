import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert,
  Divider,
  InputAdornment,
  Paper,
  IconButton,
  Grid,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PaymentIcon from '@mui/icons-material/Payment';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { formatCurrency } from '../services/paymentService';
import { processPayment } from '../services/paymentService';

// Payment method types
type PaymentMethodType = 'card' | 'paypal' | 'bank';

// Mock credit card validation
const validateCardNumber = (number: string): boolean => {
  return /^\d{16}$/.test(number.replace(/\s/g, ''));
};

const validateExpiryDate = (date: string): boolean => {
  return /^\d{2}\/\d{2}$/.test(date);
};

const validateCVV = (cvv: string): boolean => {
  return /^\d{3,4}$/.test(cvv);
};

// Props interface
interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  amount: number;
  itemName: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
}

// Steps for payment process
const steps = ['Payment Method', 'Payment Details', 'Processing', 'Confirmation'];

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onClose,
  amount,
  itemName,
  onSuccess,
  onError
}) => {
  // State
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Reset on open
  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setPaymentMethod('card');
      setCardNumber('');
      setCardName('');
      setExpiryDate('');
      setCvv('');
      setEmail('');
      setErrors({});
      setProcessing(false);
      setCompleted(false);
      setPaymentSuccessful(false);
      setPaymentError('');
      setTransactionId('');
    }
  }, [open]);

  // Handle payment method change
  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value as PaymentMethodType);
  };

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return value;
  };

  // Validate payment details
  const validatePaymentDetails = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (paymentMethod === 'card') {
      if (!cardName) {
        newErrors.cardName = 'Name on card is required';
      }
      
      if (!validateCardNumber(cardNumber)) {
        newErrors.cardNumber = 'Please enter a valid 16-digit card number';
      }
      
      if (!validateExpiryDate(expiryDate)) {
        newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
      }
      
      if (!validateCVV(cvv)) {
        newErrors.cvv = 'Please enter a valid CVV code';
      }
    }
    
    if (!email) {
      newErrors.email = 'Email is required for receipt';
    } else if (!/^\\S+@\\S+\\.\\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNext = () => {
    if (activeStep === 1 && !validatePaymentDetails()) {
      return;
    }
    
    if (activeStep === 2) {
      setProcessing(true);
      
      // Process payment
      processPayment(amount, 'USD', paymentMethod)
        .then((result) => {
          setProcessing(false);
          setCompleted(true);
          
          if (result.success) {
            setPaymentSuccessful(true);
            setTransactionId(result.transactionId || 'txn_unknown');
            onSuccess(result.transactionId || 'txn_unknown');
          } else {
            setPaymentSuccessful(false);
            setPaymentError(result.error || 'An unknown error occurred');
            onError(result.error || 'An unknown error occurred');
          }
          
          setActiveStep(3);
        })
        .catch((error) => {
          setProcessing(false);
          setCompleted(true);
          setPaymentSuccessful(false);
          setPaymentError('Network error: Could not connect to payment service');
          onError('Network error: Could not connect to payment service');
          setActiveStep(3);
        });
    } else if (activeStep < 2) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  // Handle back step
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Handle close
  const handleCloseModal = () => {
    // Only allow closing if payment process is complete or at the beginning
    if (completed || activeStep < 2) {
      onClose();
    }
  };

  // Render payment method selection
  const renderPaymentMethodStep = () => (
    <Box>
      <Typography variant="subtitle1" gutterBottom>
        Select your preferred payment method:
      </Typography>
      
      <RadioGroup
        value={paymentMethod}
        onChange={handlePaymentMethodChange}
      >
        <Paper 
          variant="outlined" 
          sx={{ 
            mb: 2, 
            p: 2, 
            borderColor: paymentMethod === 'card' ? 'primary.main' : 'divider',
            borderWidth: paymentMethod === 'card' ? 2 : 1
          }}
        >
          <FormControlLabel
            value="card"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1 }} />
                <Typography>Credit or Debit Card</Typography>
              </Box>
            }
          />
        </Paper>

        <Paper 
          variant="outlined" 
          sx={{ 
            mb: 2, 
            p: 2, 
            borderColor: paymentMethod === 'paypal' ? 'primary.main' : 'divider',
            borderWidth: paymentMethod === 'paypal' ? 2 : 1
          }}
        >
          <FormControlLabel
            value="paypal"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PaymentIcon sx={{ mr: 1 }} />
                <Typography>PayPal</Typography>
              </Box>
            }
          />
        </Paper>

        <Paper 
          variant="outlined" 
          sx={{ 
            mb: 2, 
            p: 2, 
            borderColor: paymentMethod === 'bank' ? 'primary.main' : 'divider',
            borderWidth: paymentMethod === 'bank' ? 2 : 1
          }}
        >
          <FormControlLabel
            value="bank"
            control={<Radio />}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountBalanceIcon sx={{ mr: 1 }} />
                <Typography>Bank Transfer</Typography>
              </Box>
            }
          />
        </Paper>
      </RadioGroup>
    </Box>
  );

  // Render payment details form
  const renderPaymentDetailsStep = () => (
    <Box>
      {paymentMethod === 'card' && (
        <>
          <Typography variant="subtitle1" gutterBottom>
            Enter your card details:
          </Typography>
          
          <TextField
            label="Name on Card"
            fullWidth
            margin="normal"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            error={!!errors.cardName}
            helperText={errors.cardName}
            required
          />
          
          <TextField
            label="Card Number"
            fullWidth
            margin="normal"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            error={!!errors.cardNumber}
            helperText={errors.cardNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon />
                </InputAdornment>
              ),
            }}
            required
          />
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Expiry Date"
              margin="normal"
              value={expiryDate}
              onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
              error={!!errors.expiryDate}
              helperText={errors.expiryDate}
              placeholder="MM/YY"
              required
              sx={{ flex: 1 }}
            />
            
            <TextField
              label="CVV"
              margin="normal"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              error={!!errors.cvv}
              helperText={errors.cvv}
              required
              sx={{ flex: 1 }}
            />
          </Box>
        </>
      )}
      
      {paymentMethod === 'paypal' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          You will be redirected to PayPal to complete your payment after you proceed.
        </Alert>
      )}
      
      {paymentMethod === 'bank' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Bank transfer details will be sent to your email after you proceed.
        </Alert>
      )}
      
      <Divider sx={{ my: 2 }} />
      
      <Typography variant="subtitle1" gutterBottom>
        Receipt Information:
      </Typography>
      
      <TextField
        label="Email for Receipt"
        fullWidth
        margin="normal"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={!!errors.email}
        helperText={errors.email}
        required
      />
    </Box>
  );

  // Render payment processing step
  const renderProcessingStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      <CircularProgress size={60} sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom>
        Processing your payment
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center">
        Please wait while we securely process your payment.
        Do not close this window.
      </Typography>
    </Box>
  );

  // Render confirmation step
  const renderConfirmationStep = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
      {paymentSuccessful ? (
        <>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" textAlign="center" paragraph>
            Thank you for your payment. A receipt has been sent to your email.
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, width: '100%', mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Transaction Details:
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '5fr 7fr', gap: 1 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Amount:
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  {formatCurrency(amount)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Transaction ID:
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>
                  {transactionId}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Payment Method:
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  {paymentMethod === 'card' ? 'Credit/Debit Card' : 
                   paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </>
      ) : (
        <>
          <ErrorOutlineIcon color="error" sx={{ fontSize: 60, mb: 3 }} />
          <Typography variant="h6" gutterBottom>
            Payment Failed
          </Typography>
          <Alert severity="error" sx={{ mb: 2, width: '100%' }}>
            {paymentError}
          </Alert>
          <Typography variant="body1" textAlign="center">
            Please try again with a different payment method or contact support for assistance.
          </Typography>
        </>
      )}
    </Box>
  );

  // Render current step content
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return renderPaymentMethodStep();
      case 1:
        return renderPaymentDetailsStep();
      case 2:
        return renderProcessingStep();
      case 3:
        return renderConfirmationStep();
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleCloseModal}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={processing}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {activeStep === 3 
              ? (paymentSuccessful ? 'Payment Complete' : 'Payment Failed') 
              : `Payment for ${itemName}`}
          </Typography>
          {(activeStep < 2 || completed) && (
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleCloseModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      
      <Divider />
      
      <Box sx={{ px: 3, pt: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent>
        <Box sx={{ mt: 1 }}>
          {activeStep === 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{itemName}</Typography>
                <Typography fontWeight="bold">{formatCurrency(amount)}</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
            </Box>
          )}
          
          {getStepContent(activeStep)}
        </Box>
      </DialogContent>
      
      <Divider />
      
      <DialogActions sx={{ px: 3, py: 2 }}>
        {activeStep !== 2 && activeStep !== 3 && (
          <Button
            color="inherit"
            onClick={activeStep === 0 ? handleCloseModal : handleBack}
            sx={{ mr: 1 }}
          >
            {activeStep === 0 ? 'Cancel' : 'Back'}
          </Button>
        )}
        
        {activeStep !== 2 && (
          <Button
            variant="contained"
            onClick={activeStep === 3 ? handleCloseModal : handleNext}
            disabled={processing}
          >
            {activeStep === 3 ? 'Close' : (activeStep === 1 ? 'Pay Now' : 'Continue')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PaymentModal;
