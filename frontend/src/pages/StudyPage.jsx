import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Spin, Button, Progress, Layout, Typography, message, Row, Col 
} from 'antd';
import { ArrowLeftOutlined, FireOutlined } from '@ant-design/icons';
import { studyService } from '@/services/study.service.js';
import { deckService } from '@/services/deck.service.js';
import FlashcardItem from '@/components/feature/FlashcardItem.jsx';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const StudyPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchStudyData = async () => {
      try {
        setLoading(true);
        const [deckRes, studyRes] = await Promise.all([
          deckService.getDeckById(deckId),
          studyService.getDueCards(deckId)
        ]);
        
        if (deckRes.success) setDeck(deckRes.data);
        if (studyRes.success) {
          if (studyRes.data && studyRes.data.length > 0) {
            setCards(studyRes.data);
          } else {
            setFinished(true); // Nothing to study
          }
        }
      } catch (err) {
        message.error('Failed to load study session');
      } finally {
        setLoading(false);
      }
    };
    fetchStudyData();
  }, [deckId]);

  const handleReview = async (quality) => {
    const currentCard = cards[currentIndex];
    
    try {
      await studyService.submitReview({
        flashcardId: currentCard.id,
        quality
      });
      nextCard();
    } catch (err) {
      message.error('Failed to submit review');
      nextCard(); // Still go to next to not block user
    }
  };

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setFinished(true);
      }
    }, 300); // Wait for unflip animation
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Loading your cards..." />
      </div>
    );
  }

  // Finished State
  if (finished) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 600, margin: '0 auto' }}>
        <FireOutlined style={{ fontSize: 80, color: '#f59e0b', marginBottom: 24 }} />
        <Title level={2}>You're all caught up!</Title>
        <Paragraph style={{ fontSize: 16 }}>
          You have reviewed all due cards for <b>{deck?.title || 'this deck'}</b> today. 
          Come back tomorrow for more!
        </Paragraph>
        <Button 
          type="primary" 
          size="large" 
          onClick={() => navigate('/dashboard')}
          style={{ marginTop: 24 }}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round((currentIndex / cards.length) * 100);

  return (
    <Content style={{ padding: '24px 24px', maxWidth: 800, margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/decks/${deckId}`)}
        >
          Exit Study
        </Button>
        <div style={{ fontWeight: 600, color: '#4b5563' }}>
          {currentIndex + 1} / {cards.length}
        </div>
      </div>
      
      <Progress percent={progressPercent} showInfo={false} strokeColor="#6366f1" style={{ marginBottom: 40 }} />

      {/* Flashcard Area */}
      <FlashcardItem 
        card={currentCard} 
        isFlipped={isFlipped}
        onFlip={() => setIsFlipped(!isFlipped)} 
      />

      {/* Action Buttons */}
      {isFlipped && (
        <div style={{ marginTop: 40, textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
          <Title level={4} style={{ marginBottom: 24 }}>How well did you know this?</Title>
          <Row gutter={16} justify="center">
            <Col>
              <Button danger size="large" style={{ width: 120 }} onClick={() => handleReview(1)}>
                Hard
              </Button>
            </Col>
            <Col>
              <Button size="large" style={{ width: 120, borderColor: '#3b82f6', color: '#3b82f6' }} onClick={() => handleReview(2)}>
                Good
              </Button>
            </Col>
            <Col>
              <Button type="primary" size="large" style={{ width: 120, background: '#10b981', borderColor: '#10b981' }} onClick={() => handleReview(3)}>
                Easy
              </Button>
            </Col>
          </Row>
        </div>
      )}
    </Content>
  );
};

export default StudyPage;
