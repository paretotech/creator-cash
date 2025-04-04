import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { getCreator } from '../services/mockData';
import CreatorProfile from '../components/CreatorProfile';
import { Creator } from '../types';

const CreatorPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const [creator, setCreator] = useState<Creator | null>(null);
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

  return <CreatorProfile creator={creator} />;
};

export default CreatorPage;
