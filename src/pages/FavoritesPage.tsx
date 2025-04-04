import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Link
} from '@mui/material';
import Grid from '@mui/material/Grid';
import LaunchIcon from '@mui/icons-material/Launch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Favorite, Creator } from '../types';
import { getCreator } from '../services/mockData';

const FavoritesPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!username) {
      setError('No username provided');
      setLoading(false);
      return;
    }

    // Get creator data
    const creatorData = getCreator(username);
    if (!creatorData) {
      setError('Creator not found');
      setLoading(false);
      return;
    }

    if (!creatorData.settings.enableFavorites) {
      setError('Favorites are not enabled for this creator');
      setLoading(false);
      return;
    }

    setCreator(creatorData);
    setFavorites(creatorData.favorites || []);
    
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(creatorData.favorites.map(fav => fav.category))
    );
    setCategories(uniqueCategories);
    
    setLoading(false);
  }, [username]);

  const handleGoBack = () => {
    navigate(`/creator/${username}`);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(activeCategory === category ? null : category);
  };

  const filteredFavorites = activeCategory
    ? favorites.filter(fav => fav.category === activeCategory)
    : favorites;

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !creator) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh" flexDirection="column">
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Something went wrong'}
          </Alert>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Go Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={handleGoBack} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {creator.name}'s Favorites
        </Typography>
      </Box>
      
      <Typography variant="body1" color="text.secondary" paragraph>
        These are the products, tools, and resources that {creator.name} loves and recommends.
      </Typography>
      
      {categories.length > 0 && (
        <Box sx={{ my: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Filter by Category
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categories.map(category => (
              <Chip
                key={category}
                label={category}
                onClick={() => handleCategoryClick(category)}
                color={activeCategory === category ? 'primary' : 'default'}
                variant={activeCategory === category ? 'filled' : 'outlined'}
                sx={{ mb: 1 }}
              />
            ))}
            {activeCategory && (
              <Chip 
                label="Clear Filter" 
                variant="outlined" 
                onClick={() => setActiveCategory(null)} 
                sx={{ mb: 1 }}
              />
            )}
          </Box>
        </Box>
      )}
      
      <Divider sx={{ my: 3 }} />
      
      {filteredFavorites.length === 0 ? (
        <Alert severity="info">
          No favorites found. {activeCategory ? 'Try another category or clear the filter.' : ''}
        </Alert>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 3 }}>
          {filteredFavorites.map(favorite => (
            <Box key={favorite.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
                elevation={2}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={favorite.imageUrl}
                  alt={favorite.title}
                  sx={{ objectFit: 'contain', bgcolor: '#f5f5f5', p: 2 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {favorite.title}
                    </Typography>
                    {favorite.affiliateLink && (
                      <Chip 
                        icon={<VerifiedIcon sx={{ fontSize: 16 }} />}
                        label="Affiliate" 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        sx={{ height: 24, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {favorite.description}
                  </Typography>
                  <Chip 
                    label={favorite.category} 
                    size="small" 
                    sx={{ mt: 2, fontSize: '0.7rem' }}
                    variant="outlined"
                  />
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    endIcon={<LaunchIcon />}
                    component={Link}
                    href={favorite.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    fullWidth
                  >
                    Check It Out
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default FavoritesPage;
