import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Statistic, Typography, message } from 'antd';
import { BookOutlined, ReadOutlined, CheckCircleOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { studyService } from '@/services/study.service.js';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { getGamificationState } from '@/utils/gamification.js';

const { Title, Text } = Typography;

const COLORS = ['#6366f1', '#10b981', '#f59e0b']; // Learning, Mastered, New

const getBadgeStates = (gamification) => ([
  { key: 'rookie', label: 'Rookie', achieved: gamification.totalSessions >= 1 },
  { key: 'focus', label: 'Focus 3-Day', achieved: gamification.streakDays >= 3 },
  { key: 'grinder', label: 'Point 100', achieved: gamification.points >= 100 },
]);

const StatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [gamification, setGamification] = useState(getGamificationState());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const res = await studyService.getStatistics();
        if (res.success) {
          setStats(res.data);
        } else {
          message.error(res.message || 'Failed to load statistics');
        }
      } catch (error) {
        message.error('Failed to load statistics');
      } finally {
        setGamification(getGamificationState());
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  const safeStats = stats || {
    totalDecks: 0,
    totalCards: 0,
    newCards: 0,
    learningCards: 0,
    masteredCards: 0,
  };

  const pieData = [
    { name: 'Learning', value: safeStats.learningCards },
    { name: 'Mastered', value: safeStats.masteredCards },
    { name: 'New', value: safeStats.newCards }
  ].filter(item => item.value > 0);

  const barData = [
    { name: 'New Cards', count: safeStats.newCards, fill: '#f59e0b' },
    { name: 'Learning', count: safeStats.learningCards, fill: '#6366f1' },
    { name: 'Mastered', count: safeStats.masteredCards, fill: '#10b981' },
  ];
  const badges = getBadgeStates(gamification);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', paddingBottom: 40 }}>
      <Card style={{ borderRadius: 12, marginBottom: 24 }}>
        <Title level={3} style={{ margin: 0 }}>Learning Statistics</Title>
        <Text type="secondary">Overview of your current learning progress.</Text>
      </Card>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Total Decks" value={safeStats.totalDecks} prefix={<BookOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Total Flashcards" value={safeStats.totalCards} prefix={<ReadOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Mastery Progress" value={safeStats.totalCards > 0 ? Math.round((safeStats.masteredCards / safeStats.totalCards) * 100) : 0} suffix="%" prefix={<CheckCircleOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Learning Streak" value={gamification.streakDays} suffix="days" prefix={<FireOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Total Points" value={gamification.points} prefix={<StarOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: 12 }}>
            <Statistic title="Study Sessions" value={gamification.totalSessions} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={12}>
          <Card title="Card Distribution" style={{ borderRadius: 12, height: '100%' }}>
            {pieData.length > 0 ? (
              <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Text type="secondary">No cards studied yet.</Text>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="Detailed Breakdown" style={{ borderRadius: 12, height: '100%' }}>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.5} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="Badge Progress" style={{ borderRadius: 12, marginTop: 24 }}>
        <Row gutter={[12, 12]}>
          {badges.map((badge) => (
            <Col xs={24} sm={12} lg={8} key={badge.key}>
              <Card
                size="small"
                style={{
                  borderRadius: 10,
                  borderColor: badge.achieved ? '#10b981' : '#d1d5db',
                  background: badge.achieved ? '#ecfdf5' : '#fff',
                }}
              >
                <Text strong>{badge.label}</Text>
                <div>
                  <Text type={badge.achieved ? undefined : 'secondary'}>
                    {badge.achieved ? 'Unlocked' : 'Locked'}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default StatisticsPage;
