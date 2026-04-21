import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, Spin } from 'antd';
import { theme as antdTheme } from 'antd';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import ClientLayout from '@/components/layout/ClientLayout.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { ThemeProvider } from '@/contexts/ThemeContext.jsx';

// Pages
const LoginPage = lazy(() => import('@/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage.jsx'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage.jsx'));
const DeckDetailPage = lazy(() => import('@/pages/DeckDetailPage.jsx'));
const StudyPage = lazy(() => import('@/pages/StudyPage.jsx'));
const QuizPage = lazy(() => import('@/pages/QuizPage.jsx'));
const QuizHubPage = lazy(() => import('@/pages/QuizHubPage.jsx'));
const ExplorePage = lazy(() => import('@/pages/ExplorePage.jsx'));
const StudyQueuePage = lazy(() => import('@/pages/StudyQueuePage.jsx'));
const StatisticsPage = lazy(() => import('@/pages/StatisticsPage.jsx'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage.jsx'));

const { Footer } = Layout;

const RouteFallback = () => (
  <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <Spin size="large" tip="Loading page..." />
  </div>
);

const AppContent = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Suspense fallback={<RouteFallback />}>
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
            <Route path="/quiz" element={<QuizHubPage />} />
            <Route path="/quiz/:deckId" element={<QuizPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>

      <Footer style={{ textAlign: 'center', background: 'transparent' }}>
        Vocalis ©{new Date().getFullYear()} Built for active recall
      </Footer>
    </Layout>
  );
};

const AppContentInner = () => {
  const appTheme = {
    algorithm: antdTheme.defaultAlgorithm,
    token: {
      colorPrimary: '#6d63ff',
      colorInfo: '#6d63ff',
      colorSuccess: '#10b981',
      colorWarning: '#f59e0b',
      colorError: '#ef4444',
      borderRadius: 12,
      borderRadiusLG: 16,
      wireframe: false,
      colorBgLayout: '#f8f9ff',
      colorBgContainer: 'rgba(255,255,255,0.92)',
      colorTextBase: '#0f172a',
      fontFamily: "'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      boxShadowSecondary: '0 10px 30px rgba(15, 23, 42, 0.08)',
    },
    components: {
      Card: {
        borderRadiusLG: 16,
      },
      Button: {
        borderRadius: 12,
        controlHeight: 40,
        fontWeight: 600,
      },
      Layout: {
        headerBg: 'rgba(255,255,255,0.88)',
        siderBg: 'rgba(255,255,255,0.88)',
      },
      Menu: {
        itemBorderRadius: 10,
        itemHeight: 42,
      },
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
