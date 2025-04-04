import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { getCreator } from '../services/mockData';
import { Creator, Product } from '../types';
import ProductForm from '../components/ProductForm';
import { formatCurrency } from '../services/paymentService';

const ProductsPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    // Remove @ if it exists in the URL parameter
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    
    // Fetch creator data
    const creatorData = getCreator(cleanUsername);
    
    if (creatorData) {
      setCreator(creatorData);
      setLoading(false);
    } else {
      setError(`Creator @${cleanUsername} not found`);
      setLoading(false);
    }
  }, [username]);

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleCancelPurchase = () => {
    setSelectedProduct(null);
  };

  const handlePurchaseSuccess = () => {
    // Navigate back to products list
    setSelectedProduct(null);
  };

  const handleBackToProfile = () => {
    if (username) {
      navigate(`/${username}`);
    }
  };

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="70vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !creator) {
    return (
      <Container>
        <Box textAlign="center" my={8}>
          <Typography variant="h5" color="error" gutterBottom>
            {error || 'An error occurred'}
          </Typography>
          <Typography variant="body1">
            The creator you're looking for doesn't exist or may have changed their username.
          </Typography>
        </Box>
      </Container>
    );
  }

  if (selectedProduct) {
    return (
      <ProductForm 
        creator={creator} 
        product={selectedProduct} 
        onSuccess={handlePurchaseSuccess} 
        onCancel={handleCancelPurchase} 
      />
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {creator.name}'s Store
          </Typography>
          <Button variant="outlined" onClick={handleBackToProfile}>
            Back to Profile
          </Button>
        </Box>

        {creator.products.length === 0 ? (
          <Box textAlign="center" my={8}>
            <Typography variant="h6" color="text.secondary">
              No products available at this time.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {creator.products.map((product) => (
              <Box key={product.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={product.imageUrl}
                    alt={product.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="h2" gutterBottom>
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
                        {product.type === 'digital' ? 'Digital' : 'Physical'}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      fullWidth
                      onClick={() => handlePurchase(product)}
                    >
                      Buy Now
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ProductsPage;
