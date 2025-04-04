import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, CircularProgress, Container, Box, Alert } from '@mui/material';
import WaitlistForm from '../components/WaitlistForm';
import { getCreator } from '../services/mockData';
import { Creator } from '../types';

const WaitlistPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (username) {
      // Fetch creator data
      const fetchedCreator = getCreator(username);
      
      if (fetchedCreator) {
        setCreator(fetchedCreator);
        
        // Check if waitlist is enabled
        if (!fetchedCreator.settings.enableWaitlist || !fetchedCreator.waitlistConfig) {
          setError(`${fetchedCreator.name} doesn't have a waitlist available at this time.`);
        }
      } else {
        setError('Creator not found');
      }
      
      setLoading(false);
    }
  }, [username]);

  const handleSuccess = () => {
    // Navigate back to creator profile after successful submission
    setTimeout(() => {
      navigate(`/${username}`);
    }, 2000);
  };

  const handleCancel = () => {
    // Go back to creator profile
    navigate(`/${username}`);
  };

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !creator || !creator.waitlistConfig) {
    return (
      <Container>
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">{error || 'Something went wrong'}</Alert>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography
              variant="body1"
              sx={{ cursor: 'pointer', textDecoration: 'underline', color: 'primary.main' }}
              onClick={() => navigate(`/${username}`)}
            >
              Back to profile
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  return <WaitlistForm creator={creator} onSuccess={handleSuccess} onCancel={handleCancel} />;
};

export default WaitlistPage;
