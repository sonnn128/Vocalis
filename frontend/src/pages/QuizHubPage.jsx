import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Empty, List, Row, Space, Spin, Statistic, Tag, Typography, message } from 'antd';
import { PlayCircleOutlined, TrophyOutlined, HistoryOutlined } from '@ant-design/icons';
import { deckService } from '@/services/deck.service.js';

const { Title, Text } = Typography;

const QUIZ_HISTORY_KEY = 'vocalis.quiz.history';

const QuizHubPage = () => {
  const navigate = useNavigate();
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);

  const history = useMemo(() => {
    try {
      const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.slice(0, 10) : [];
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        setLoading(true);
        const res = await deckService.getMyDecks(0, 100);
        if (res.success) {
          setDecks(res.data?.content || []);
        } else {
          message.error(res.message || 'Failed to load decks');
        }
      } catch (error) {
        message.error('Failed to load decks');
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const eligibleDecks = decks.filter((deck) => (deck.cardCount || 0) >= 4);

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space direction="vertical" size={4}>
          <Title level={3} style={{ margin: 0 }}>Quiz Mode</Title>
          <Text type="secondary">
            Pick a deck and test recall with randomized multiple-choice questions.
          </Text>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card style={{ borderRadius: 12 }} title="Available Decks">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                <Spin size="large" />
              </div>
            ) : eligibleDecks.length === 0 ? (
              <Empty description="Need at least one deck with 4+ cards to start a quiz." />
            ) : (
              <List
                dataSource={eligibleDecks}
                renderItem={(deck) => (
                  <List.Item
                    actions={[
                      <Button
                        key={deck.id}
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => navigate(`/quiz/${deck.id}`)}
                      >
                        Start Quiz
                      </Button>,
                    ]}
                  >
                    <List.Item.Meta
                      title={deck.title}
                      description={deck.description || 'No description'}
                    />
                    <Tag color="blue">{deck.cardCount || 0} cards</Tag>
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Card style={{ borderRadius: 12 }}>
              <Statistic
                title="Quiz-ready decks"
                value={eligibleDecks.length}
                prefix={<TrophyOutlined />}
              />
            </Card>

            <Card
              style={{ borderRadius: 12 }}
              title={<Space><HistoryOutlined /> Recent Sessions</Space>}
            >
              {history.length === 0 ? (
                <Text type="secondary">No quiz history yet.</Text>
              ) : (
                <List
                  dataSource={history}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        title={item.deckTitle || 'Unknown deck'}
                        description={`${item.score}/${item.total} (${item.percent}%)`}
                      />
                    </List.Item>
                  )}
                />
              )}
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default QuizHubPage;
