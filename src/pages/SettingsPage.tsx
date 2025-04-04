import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Container, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CreatorSettingsForm from '../components/CreatorSettings';
import { getCreator } from '../services/mockData';
import { Creator } from '../types';

const SettingsPage: React.FC = () => {
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

  const handleSettingsUpdated = (updatedCreator: Creator) => {
    setCreator(updatedCreator);
  };

  const handleBack = () => {
    navigate(`/${username}`);
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

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Button 
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to profile
        </Button>
      </Container>
      
      <CreatorSettingsForm 
        creator={creator} 
        onSettingsUpdated={handleSettingsUpdated} 
      />
    </Box>
  );
};

export default SettingsPage;
