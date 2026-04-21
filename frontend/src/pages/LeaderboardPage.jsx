import React, { useMemo } from 'react';
import { Card, List, Tag, Typography, Space, Empty } from 'antd';
import { CrownOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { getGamificationState } from '@/utils/gamification.js';

const { Title, Text } = Typography;

const QUIZ_HISTORY_KEY = 'vocalis.quiz.history';

const LeaderboardPage = () => {
  const gamification = getGamificationState();

  const leaderboardData = useMemo(() => {
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
      const history = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(history)) return [];

      const byDeck = new Map();
      history.forEach((item) => {
        const key = item.deckId || 'unknown';
        const prev = byDeck.get(key) || {
          deckId: key,
          deckTitle: item.deckTitle || 'Unknown deck',
          bestPercent: 0,
          bestScore: 0,
          attempts: 0,
        };

        prev.attempts += 1;
        if ((item.percent || 0) > prev.bestPercent) {
          prev.bestPercent = item.percent || 0;
          prev.bestScore = item.score || 0;
        }
        byDeck.set(key, prev);
      });

      return [...byDeck.values()].sort((a, b) => b.bestPercent - a.bestPercent).slice(0, 10);
    } catch {
      return [];
    }
  }, []);

  const badges = [
    {
      key: 'rookie',
      title: 'Rookie',
      achieved: gamification.totalSessions >= 1,
      hint: 'Complete 1 study/quiz session',
    },
    {
      key: 'streak3',
      title: 'Streak 3',
      achieved: gamification.streakDays >= 3,
      hint: 'Maintain 3-day streak',
    },
    {
      key: 'point100',
      title: '100 Points',
      achieved: gamification.points >= 100,
      hint: 'Earn 100 total points',
    },
  ];

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Leaderboard & Badges</Title>
        <Text type="secondary">Quick launch ranking based on your quiz performance.</Text>
      </Card>

      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space size={20} wrap>
          <Tag color="gold" icon={<StarOutlined />}>Points: {gamification.points}</Tag>
          <Tag color="volcano" icon={<FireOutlined />}>Streak: {gamification.streakDays} days</Tag>
          <Tag color="blue">Sessions: {gamification.totalSessions}</Tag>
        </Space>
      </Card>

      <Card style={{ borderRadius: 12, marginBottom: 16 }} title="Badges">
        <Space size={10} wrap>
          {badges.map((badge) => (
            <Tag
              key={badge.key}
              color={badge.achieved ? 'green' : 'default'}
              icon={badge.achieved ? <CrownOutlined /> : undefined}
            >
              {badge.title} - {badge.achieved ? 'Unlocked' : badge.hint}
            </Tag>
          ))}
        </Space>
      </Card>

      <Card style={{ borderRadius: 12 }} title="Top Deck Quiz Scores">
        {leaderboardData.length === 0 ? (
          <Empty description="No quiz attempts yet." />
        ) : (
          <List
            dataSource={leaderboardData}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={`#${index + 1} ${item.deckTitle}`}
                  description={`Best: ${item.bestPercent}% | Attempts: ${item.attempts}`}
                />
                <Tag color={index === 0 ? 'gold' : 'blue'}>{item.bestScore} points</Tag>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default LeaderboardPage;
