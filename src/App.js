import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';

import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Messaging from './pages/Messaging';
import Reports from './pages/Reports';
import UserProfilePage from "./pages/UserProfilePage";
import ConversationPage from "./pages/ConversationPage";

function App() {
  const [route, setRoute] = useState({ name: 'login' });
  const [routeParams, setRouteParams] = useState({});
  const { token, profile, loadingUser } = useAuth();

  const navigate = (newRoute, params = {}) => {
    setRoute({ name: newRoute });
    setRouteParams(params);
  };

  const [showProfileReminder, setShowProfileReminder] = useState(false);

  useEffect(() => {
    if (profile && !profile.profile_complete) {
      setShowProfileReminder(true);
    } else {
      setShowProfileReminder(false);
    }
  }, [profile]);

  const renderPage = () => {
    switch (route.name) {
      case 'login':
        return <Login onNavigate={navigate} />;
      case 'register':
        return <Register onNavigate={navigate} />;
      case 'profile':
        return (
          <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
            <Profile onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'posts':
        return (
          <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
            <Posts onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'postDetail':
        return (
          <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
            <PostDetail postId={routeParams.postId} onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'messaging':
        return (
          <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
            <Messaging onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'reports':
        return (
          <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
            <Reports onNavigate={navigate} />
          </ProtectedRoute>
        );
      case 'UserProfilePage':
        return (
            <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
              <UserProfilePage userId={routeParams.userId} onNavigate={navigate} />
            </ProtectedRoute>
        );
      case 'conversation':
        return (
            <ProtectedRoute fallback={<Login onNavigate={navigate} />}>
              <ConversationPage conversationId={routeParams.conversationId} onNavigate={navigate} />
            </ProtectedRoute>
  );
      default:
        return <Login onNavigate={navigate} />;
    }
  };

  if (loadingUser) return <div>Loading user data...</div>;

  return (
    <div>
      {token && (
        <>
          <Header onNavigate={navigate} />
          {showProfileReminder && (
            <div
              style={{
                backgroundColor: '#ffeb3b',
                padding: '10px',
                margin: '10px',
                borderRadius: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 'bold',
              }}
            >
              <span>Your profile seems incomplete. Please</span>
              <button
                onClick={() => navigate('profile')}
                style={{ marginLeft: '10px' }}
              >
                Complete your profile
              </button>
              <button
                onClick={() => setShowProfileReminder(false)}
                style={{ marginLeft: 'auto' }}
                aria-label="Dismiss profile completion reminder"
              >
                ✕
              </button>
            </div>
          )}
        </>
      )}
      {renderPage()}
    </div>
  );
}

export default App;
