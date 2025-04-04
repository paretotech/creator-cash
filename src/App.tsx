import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Layout
import Layout from './components/Layout';

// Pages
import HomePage from './pages/HomePage';
import CreatorPage from './pages/CreatorPage';
import QuestionPage from './pages/QuestionPage';
import BookingPage from './pages/BookingPage';
import TipPage from './pages/TipPage';
import ProductsPage from './pages/ProductsPage';
import ShoutoutPage from './pages/ShoutoutPage';
import HireServicePage from './pages/HireServicePage';
import PrivateGroupPage from './pages/PrivateGroupPage';
import WaitlistPage from './pages/WaitlistPage';
import FavoritesPage from './pages/FavoritesPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#5271ff',
    },
    secondary: {
      main: '#ff5757',
    },
  },
  typography: {
    fontFamily: '\'Inter\', \'Roboto\', \'Helvetica\', \'Arial\', sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            
            {/* Creator profile route */}
            <Route path="/:username" element={<CreatorPage />} />
            
            {/* Creator interaction routes */}
            <Route path="/:username/ask" element={<QuestionPage />} />
            <Route path="/:username/book" element={<BookingPage />} />
            <Route path="/:username/tip" element={<TipPage />} />
            <Route path="/:username/products" element={<ProductsPage />} />
            <Route path="/:username/shoutout" element={<ShoutoutPage />} />
            <Route path="/:username/hire" element={<HireServicePage />} />
            <Route path="/:username/group" element={<PrivateGroupPage />} />
            <Route path="/:username/waitlist" element={<WaitlistPage />} />
            <Route path="/:username/favorites" element={<FavoritesPage />} />
            <Route path="/:username/settings" element={<SettingsPage />} />
            
            {/* 404 route */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
