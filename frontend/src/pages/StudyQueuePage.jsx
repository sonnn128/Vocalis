import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, Empty, Spin, Tag, Space, message } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { studyService } from '@/services/study.service.js';

const { Title, Text } = Typography;

const StudyQueuePage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDueCards = async () => {
      try {
        setLoading(true);
        const res = await studyService.getDueCards();
        if (res.success) {
          setCards(Array.isArray(res.data) ? res.data : []);
        } else {
          message.error(res.message || 'Failed to load due cards');
        }
      } catch (error) {
        message.error('Failed to load due cards');
      } finally {
        setLoading(false);
      }
    };

    loadDueCards();
  }, []);

  const deckStats = useMemo(() => {
    const byDeck = new Map();
    cards.forEach((card) => {
      const key = card.deckId || 'unknown';
      const prev = byDeck.get(key) || { deckId: card.deckId, dueCount: 0, preview: card.frontText };
      prev.dueCount += 1;
      byDeck.set(key, prev);
    });
    return [...byDeck.values()].sort((a, b) => b.dueCount - a.dueCount);
  }, [cards]);

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <Card style={{ borderRadius: 12, marginBottom: 16 }}>
        <Space direction="vertical" size={4}>
          <Title level={3} style={{ margin: 0 }}>Study Queue</Title>
          <Text type="secondary">
            Review cards that are due today based on your SRS progress.
          </Text>
        </Space>
      </Card>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
          <Spin size="large" />
        </div>
      ) : deckStats.length === 0 ? (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="No due cards today. Great job!" />
        </Card>
      ) : (
        <Card style={{ borderRadius: 12 }}>
          <List
            itemLayout="horizontal"
            dataSource={deckStats}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key={`study-${item.deckId}`}
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => navigate(`/study/${item.deckId}`)}
                  >
                    Start Study
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>Deck {item.deckId?.slice(0, 8) || 'Unknown'}</span>
                      <Tag icon={<ClockCircleOutlined />} color="blue">
                        {item.dueCount} due
                      </Tag>
                    </Space>
                  }
                  description={`Example card: ${item.preview || 'No preview available'}`}
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default StudyQueuePage;
