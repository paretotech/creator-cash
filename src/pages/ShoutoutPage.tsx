import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container } from '@mui/material';
import ShoutoutForm from '../components/ShoutoutForm';
import { getCreator } from '../services/mockData';
import { Creator } from '../types';

const ShoutoutPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      const fetchedCreator = getCreator(username);
      if (fetchedCreator) {
        setCreator(fetchedCreator);
      } else {
        setError(`Creator with username "${username}" not found.`);
      }
    } else {
      setError('No creator specified.');
    }
    setLoading(false);
  }, [username]);

  const handleSuccess = () => {
    // Navigate back to creator profile after successful submission
    navigate(`/creator/${username}`);
  };

  const handleCancel = () => {
    // Navigate back to creator profile if user cancels
    navigate(`/creator/${username}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !creator) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" gutterBottom>
          Error
        </Typography>
        <Typography variant="body1">{error || 'An unknown error occurred.'}</Typography>
      </Container>
    );
  }

  if (creator.shoutoutOptions.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h5" gutterBottom>
          No Shoutout Options Available
        </Typography>
        <Typography variant="body1">
          {creator.name} doesn't currently offer any shoutout options.
        </Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <ShoutoutForm 
        creator={creator} 
        onSuccess={handleSuccess} 
        onCancel={handleCancel} 
      />
    </Box>
  );
};

export default ShoutoutPage;
