import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ClientLayout from '@/components/layout/ClientLayout.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';

// Pages
import LoginPage from '@/pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import DeckDetailPage from '@/pages/DeckDetailPage.jsx';
import StudyPage from '@/pages/StudyPage.jsx';
import QuizPage from '@/pages/QuizPage.jsx';
import ExplorePage from '@/pages/ExplorePage.jsx';
import StudyQueuePage from '@/pages/StudyQueuePage.jsx';
import StatisticsPage from '@/pages/StatisticsPage.jsx';

const { Footer } = Layout;

const AppContent = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes with dashboard layout */}
        <Route
          element={
            <ProtectedRoute>
              <ClientLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<Navigate to="/" replace />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/study" element={<StudyQueuePage />} />
          <Route path="/decks/:deckId" element={<DeckDetailPage />} />
          <Route path="/study/:deckId" element={<StudyPage />} />
          <Route path="/quiz/:deckId" element={<QuizPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        Vocalis ©{new Date().getFullYear()} Built for active recall
      </Footer>
    </Layout>
  );
};

const AppContentInner = () => {
  const appTheme = {
    token: {
      colorPrimary: '#6366f1',
      borderRadius: 8,
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    },
  };

  return (
    <ConfigProvider theme={appTheme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContentInner />
    </ThemeProvider>
  );
}

export default App;
