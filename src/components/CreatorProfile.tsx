import React from 'react';
import { Box, Typography, Avatar, Button, Container, Paper, Stack, IconButton, Chip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';
import { Creator } from '../types';
import { formatCurrency } from '../services/paymentService';
import { useNavigate } from 'react-router-dom';

interface CreatorProfileProps {
  creator: Creator;
}

const CreatorProfile: React.FC<CreatorProfileProps> = ({ creator }) => {
  const navigate = useNavigate();

  const handleAskQuestion = () => {
    navigate(`/${creator.username}/ask`);
  };

  const handleBookCall = () => {
    navigate(`/${creator.username}/book`);
  };

  const handleBuyStuff = () => {
    navigate(`/${creator.username}/products`);
  };

  const handleGetShoutout = () => {
    navigate(`/${creator.username}/shoutout`);
  };

  const handleHireMe = () => {
    navigate(`/${creator.username}/hire`);
  };

  const handleJoinGroup = () => {
    navigate(`/${creator.username}/group`);
  };

  const handleSendTip = () => {
    navigate(`/${creator.username}/tip`);
  };
  
  const handleJoinWaitlist = () => {
    navigate(`/${creator.username}/waitlist`);
  };

  const handleViewFavorites = () => {
    navigate(`/${creator.username}/favorites`);
  };

  const handleSettings = () => {
    navigate(`/${creator.username}/settings`);
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 4, borderRadius: 2, position: 'relative' }}>
        {/* Settings button */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <IconButton onClick={handleSettings} aria-label="settings">
            <SettingsIcon />
          </IconButton>
        </Box>
        
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            src={creator.avatarUrl}
            alt={creator.name}
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h4" fontWeight="bold">
            {creator.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1} textAlign="center">
            {creator.bio}
          </Typography>
        </Box>

        <Stack spacing={2} mt={4}>
          {creator.settings.enableQuestions && creator.questionResponseOptions.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              onClick={handleAskQuestion}
              sx={{ py: 1.5 }}
            >
              📝 Ask Me a Question (from {formatCurrency(Math.min(...creator.questionResponseOptions.map(option => option.price)))})
            </Button>
          )}

          {creator.settings.enableCalls && (
            <Button
              variant="contained"
              color="secondary"
              size="large"
              fullWidth
              onClick={handleBookCall}
              sx={{ py: 1.5 }}
            >
              📅 Book a Call ({formatCurrency(creator.callPrice.min)}–{formatCurrency(creator.callPrice.max)})
            </Button>
          )}

          {creator.settings.enableProducts && (
            <Button
              variant="contained"
              color="success"
              size="large"
              fullWidth
              onClick={handleBuyStuff}
              sx={{ py: 1.5 }}
            >
              🛍️ Buy My Stuff
            </Button>
          )}

          {creator.settings.enableShoutouts && (
            <Button
              variant="contained"
              color="info"
              size="large"
              fullWidth
              onClick={handleGetShoutout}
              sx={{ py: 1.5 }}
            >
              📣 Get A Shoutout
            </Button>
          )}

          {creator.settings.enableHiring && (
            <Button
              variant="contained"
              color="warning"
              size="large"
              fullWidth
              onClick={handleHireMe}
              sx={{ py: 1.5 }}
            >
              💼 Hire Me
            </Button>
          )}

          {creator.settings.enablePrivateGroups && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleJoinGroup}
              sx={{ py: 1.5, bgcolor: '#9c27b0', '&:hover': { bgcolor: '#7b1fa2' } }}
            >
              👥 Join Private Group
            </Button>
          )}

          {creator.settings.enableTips && (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleSendTip}
              sx={{ py: 1.5 }}
            >
              💸 Send a Tip ($1+)
            </Button>
          )}

          {creator.settings.enableWaitlist && (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleJoinWaitlist}
              sx={{ 
                py: 1.5, 
                borderColor: '#ff5722', 
                color: '#ff5722', 
                '&:hover': { 
                  borderColor: '#e64a19',
                  backgroundColor: 'rgba(255, 87, 34, 0.04)' 
                } 
              }}
              startIcon={<PeopleIcon />}
            >
              Join Waitlist
              {creator.waitlistConfig?.estimatedWaitTime && (
                <Chip 
                  size="small" 
                  label={`~${creator.waitlistConfig.estimatedWaitTime} wait`} 
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Button>
          )}

          {creator.settings.enableFavorites && creator.favorites.length > 0 && (
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={handleViewFavorites}
              sx={{ 
                py: 1.5,
                borderColor: '#9c27b0', 
                color: '#9c27b0', 
                '&:hover': { 
                  borderColor: '#7b1fa2',
                  backgroundColor: 'rgba(156, 39, 176, 0.04)' 
                } 
              }}
            >
              My Favorites
              <Chip 
                size="small" 
                label={`${creator.favorites.length} items`} 
                sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
              />
            </Button>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default CreatorProfile;
