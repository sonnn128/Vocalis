import React from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import {
  BookOutlined,
  GlobalOutlined,
  PlusOutlined,
  LogoutOutlined,
  UserOutlined,
  BarChartOutlined,
  ReadOutlined,
  QuestionCircleOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext.jsx';

const { Sider, Header, Content } = Layout;

const ClientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { token } = theme.useToken();

  const selectedKey = React.useMemo(() => {
    if (location.pathname.startsWith('/explore')) return '/explore';
    if (location.pathname.startsWith('/study')) return '/study';
    if (location.pathname.startsWith('/quiz')) return '/quiz';
    if (location.pathname.startsWith('/statistics')) return '/statistics';
    if (location.pathname.startsWith('/leaderboard')) return '/leaderboard';
    return '/';
  }, [location.pathname]);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate('/profile'),
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      danger: true,
      label: 'Logout',
      onClick: async () => {
        await logout();
        navigate('/login');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: token.colorBgLayout }}>
      <Sider
        width={260}
        theme="light"
        breakpoint="lg"
        collapsedWidth={0}
        style={{
          borderRight: `1px solid ${token.colorBorderSecondary}`,
          background: token.colorBgContainer,
          boxShadow: '8px 0 28px rgba(99, 102, 241, 0.08)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '0 16px',
            cursor: 'pointer',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            backdropFilter: 'blur(10px)',
          }}
          onClick={() => navigate('/')}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${token.colorPrimary}, #8b5cf6)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              boxShadow: `0 10px 24px ${token.colorPrimary}55`,
            }}
          >
            V
          </div>
          <div style={{ fontWeight: 800, color: token.colorTextHeading, fontSize: 16 }}>
            Vocalis
          </div>
        </div>

        <div style={{ padding: 16 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            block
            onClick={() => navigate('/?create=true')}
          >
            New Deck
          </Button>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ borderRight: 0 }}
          items={[
            {
              key: '/',
              icon: <BookOutlined />,
              label: 'My Decks',
              onClick: () => navigate('/'),
            },
            {
              key: '/explore',
              icon: <GlobalOutlined />,
              label: 'Explore',
              onClick: () => navigate('/explore'),
            },
            {
              key: '/study',
              icon: <ReadOutlined />,
              label: 'Study Queue',
              onClick: () => navigate('/study'),
            },
            {
              key: '/statistics',
              icon: <BarChartOutlined />,
              label: 'Statistics',
              onClick: () => navigate('/statistics'),
            },
            {
              key: '/quiz',
              icon: <QuestionCircleOutlined />,
              label: 'Quiz Mode',
              onClick: () => navigate('/quiz'),
            },
            {
              key: '/leaderboard',
              icon: <TrophyOutlined />,
              label: 'Leaderboard',
              onClick: () => navigate('/leaderboard'),
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            height: 64,
            padding: '0 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: token.colorBgContainer,
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            backdropFilter: 'blur(8px)',
          }}
        >
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <Avatar
                size={36}
                style={{ backgroundColor: token.colorPrimary }}
              >
                {(user?.fullName || user?.username || 'U')[0].toUpperCase()}
              </Avatar>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <div style={{ fontWeight: 700, color: token.colorTextHeading }}>
                  {user?.fullName || user?.username || 'User'}
                </div>
                <div style={{ fontSize: 12, color: token.colorTextSecondary }}>
                  {user?.email || ''}
                </div>
              </div>
            </div>
          </Dropdown>
        </Header>

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ClientLayout;
