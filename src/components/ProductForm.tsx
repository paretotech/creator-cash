import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, 
  Paper, Container, CircularProgress, Alert,
  Select, MenuItem, FormControl, InputLabel,
  Card, CardMedia, CardContent, FormHelperText,
  Grid, SelectChangeEvent
} from '@mui/material';
import { Creator, Product } from '../types';
import { formatCurrency } from '../services/paymentService';
import { processPayment } from '../services/paymentService';
import { purchaseProduct } from '../services/mockData';

interface ProductFormProps {
  creator: Creator;
  product: Product;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ creator, product, onSuccess, onCancel }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleQuantityChange = (event: SelectChangeEvent<number>) => {
    setQuantity(event.target.value as number);
  };

  const totalAmount = product.price * quantity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email) {
      setError('Please fill out all required fields');
      return;
    }

    if (product.type === 'physical' && !shippingAddress) {
      setError('Please provide a shipping address for physical products');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Process payment first
      const paymentResult = await processPayment(totalAmount);
      
      if (paymentResult.success) {
        // If payment succeeded, record the purchase
        purchaseProduct(
          creator.username, 
          name, 
          email, 
          product.id, 
          quantity, 
          shippingAddress
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
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Purchase Product
        </Typography>
        
        <Card sx={{ mb: 4 }}>
          <CardMedia
            component="img"
            height="200"
            image={product.imageUrl}
            alt={product.title}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {product.description}
            </Typography>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary">
                {formatCurrency(product.price)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {product.type === 'digital' ? 'Digital Product' : 'Physical Product'}
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        {success ? (
          <Box textAlign="center" my={4}>
            <Alert severity="success" sx={{ mb: 2 }}>
              Your purchase has been completed successfully!
            </Alert>
            <Typography variant="body1" paragraph>
              {product.type === 'digital' 
                ? 'You will receive download instructions via email shortly.' 
                : 'Your order has been placed and will be shipped soon.'}
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
              <InputLabel id="quantity-select-label">Quantity</InputLabel>
              <Select
                labelId="quantity-select-label"
                value={quantity}
                label="Quantity"
                onChange={handleQuantityChange}
              >
                {[1, 2, 3, 4, 5].map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            {product.type === 'physical' && (
              <TextField
                label="Shipping Address"
                multiline
                rows={3}
                fullWidth
                margin="normal"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                placeholder="Please provide your full shipping address"
              />
            )}
            
            <Box mt={3}>
              <Typography variant="h6" gutterBottom textAlign="right">
                Total: {formatCurrency(totalAmount)}
              </Typography>
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
                {loading ? <CircularProgress size={24} /> : 'Complete Purchase'}
              </Button>
            </Box>
          </form>
        )}
      </Paper>
    </Container>
  );
};

export default ProductForm;
