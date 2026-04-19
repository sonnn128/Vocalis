import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';
import {
  BookOutlined,
  LogoutOutlined,
  UserOutlined,
  PlusOutlined,
  HomeOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { Button, Avatar, Dropdown, Tooltip } from 'antd';

const VocalisNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <nav className="vocalis-navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-logo">
          <BookOutlined className="brand-icon" />
          <span className="brand-name">Vocalis</span>
        </Link>
      </div>

      <div className="navbar-center">
        <Link
          to="/dashboard"
          className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
        >
          <HomeOutlined /> My Decks
        </Link>
        <Link
          to="/explore"
          className={`nav-link ${location.pathname === '/explore' ? 'active' : ''}`}
        >
          <GlobalOutlined /> Explore
        </Link>
      </div>

      <div className="navbar-actions">
        <Tooltip title="Create new deck">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/dashboard?create=true')}
            className="create-btn"
          >
            New Deck
          </Button>
        </Tooltip>

        {user ? (
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <div className="user-avatar-wrapper">
              <Avatar
                size={36}
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', cursor: 'pointer' }}
              >
                {(user.fullName || user.username || 'U')[0].toUpperCase()}
              </Avatar>
            </div>
          </Dropdown>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register">
              <Button type="primary">Sign Up</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default VocalisNavbar;
