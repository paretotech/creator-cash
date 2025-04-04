import React from 'react';
import { 
  Box, Typography, Container, Button,
  Card, CardContent, CardActions, Paper, Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { creators } from '../services/mockData';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          CreatorCash
        </Typography>
        <Typography variant="h5" component="p" color="text.secondary" paragraph>
          One link for creators to monetize their audience
        </Typography>
        <Box sx={{ mt: 4, mb: 8 }}>
          <Button 
            variant="contained" 
            size="large" 
            sx={{ px: 4, py: 1.5, borderRadius: 2 }}
            onClick={() => navigate('/johndoe')}
          >
            See Demo Creator
          </Button>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center">
          How It Works
        </Typography>
        <Divider sx={{ mb: 4 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" gutterBottom>📝</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Ask Questions
            </Typography>
            <Typography variant="body1">
              Followers pay to ask questions that creators answer directly
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" gutterBottom>📅</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Book Calls
            </Typography>
            <Typography variant="body1">
              Schedule 1:1 video calls with your favorite creators
            </Typography>
          </Box>
          
          <Box sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="h3" color="primary" gutterBottom>💸</Typography>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Send Tips
            </Typography>
            <Typography variant="body1">
              Support creators with tips and optional messages
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Typography variant="h4" gutterBottom fontWeight="bold" textAlign="center" sx={{ mb: 4 }}>
        Featured Creators
      </Typography>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 8 }}>
        {Object.values(creators).map((creator) => (
          <Box key={creator.username} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)' } }}>
            <Card raised sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <Box
                  component="img"
                  src={creator.avatarUrl}
                  alt={creator.name}
                  sx={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%', 
                    mb: 2,
                    objectFit: 'cover'
                  }}
                />
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold" textAlign="center">
                  {creator.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph textAlign="center">
                  {creator.bio}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(`/@${creator.username}`)}
                >
                  View Profile
                </Button>
              </CardActions>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default HomePage;
