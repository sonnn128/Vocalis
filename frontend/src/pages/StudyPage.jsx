import React, { useMemo, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Spin, Button, Progress, Layout, Typography, message, Row, Col, Segmented, Card, Input, Space
} from 'antd';
import { ArrowLeftOutlined, FireOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { studyService } from '@/services/study.service.js';
import { deckService } from '@/services/deck.service.js';
import FlashcardItem from '@/components/feature/FlashcardItem.jsx';
import { addStudyActivity } from '@/utils/gamification.js';

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
  const [studyMode, setStudyMode] = useState('flashcard');
  const [typingAnswer, setTypingAnswer] = useState('');
  const [typingChecked, setTypingChecked] = useState(false);
  const [quizSelected, setQuizSelected] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);
  const [sessionReward, setSessionReward] = useState(null);

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
      const nextReviewedCount = reviewedCount + 1;
      setReviewedCount(nextReviewedCount);
      nextCard(nextReviewedCount);
    } catch (err) {
      message.error('Failed to submit review');
      nextCard(); // Still go to next to not block user
    }
  };

  const nextCard = (nextReviewedCount = reviewedCount) => {
    setIsFlipped(false);
    setTypingAnswer('');
    setTypingChecked(false);
    setQuizSelected(null);
    setQuizChecked(false);
    setTimeout(() => {
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        const pointsEarned = nextReviewedCount * 5;
        const gamification = addStudyActivity({
          cardsReviewed: nextReviewedCount,
          pointsEarned,
        });
        setSessionReward({
          pointsEarned,
          reviewedCount: nextReviewedCount,
          streakDays: gamification.streakDays,
        });
        setFinished(true);
      }
    }, 300); // Wait for unflip animation
  };

  const currentCard = cards[currentIndex];

  const normalizedTypingAnswer = typingAnswer.trim().toLowerCase();
  const normalizedCorrectAnswer = (currentCard?.backText || '').trim().toLowerCase();
  const isTypingCorrect = normalizedTypingAnswer.length > 0
    && (normalizedTypingAnswer === normalizedCorrectAnswer
      || normalizedCorrectAnswer.includes(normalizedTypingAnswer));

  const quizOptions = useMemo(() => {
    if (!currentCard) return [];
    const distractors = cards
      .filter((card) => card.id !== currentCard.id && card.backText)
      .map((card) => card.backText)
      .filter((text, index, arr) => arr.indexOf(text) === index)
      .slice(0, 3);

    const options = [...distractors, currentCard.backText].filter(Boolean);
    return options.sort(() => Math.random() - 0.5);
  }, [cards, currentCard]);

  const canShowReviewButtons = (studyMode === 'flashcard' && isFlipped)
    || (studyMode === 'typing' && typingChecked)
    || (studyMode === 'quiz' && quizChecked);

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
        <Paragraph style={{ marginBottom: 4 }}>
          Session reward: <b>+{sessionReward?.pointsEarned || 0} points</b> ({sessionReward?.reviewedCount || 0} cards reviewed)
        </Paragraph>
        <Paragraph type="secondary">
          Current streak: <b>{sessionReward?.streakDays || 0} day(s)</b>
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

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
        <Segmented
          value={studyMode}
          onChange={(value) => {
            setStudyMode(value);
            setIsFlipped(false);
            setTypingAnswer('');
            setTypingChecked(false);
            setQuizSelected(null);
            setQuizChecked(false);
          }}
          options={[
            { label: 'Flashcard', value: 'flashcard' },
            { label: 'Typing', value: 'typing' },
            { label: 'Quiz', value: 'quiz' },
          ]}
        />
      </div>

      {studyMode === 'flashcard' && (
        <FlashcardItem
          card={currentCard}
          isFlipped={isFlipped}
          onFlip={() => setIsFlipped(!isFlipped)}
        />
      )}

      {studyMode === 'typing' && (
        <Card style={{ borderRadius: 12 }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>{currentCard.frontText}</Title>
            <Input
              placeholder="Type the meaning..."
              value={typingAnswer}
              onChange={(e) => setTypingAnswer(e.target.value)}
              onPressEnter={() => setTypingChecked(true)}
            />
            <Button
              onClick={() => setTypingChecked(true)}
              disabled={!typingAnswer.trim()}
            >
              Check Answer
            </Button>
            {typingChecked && (
              <div style={{ color: isTypingCorrect ? '#059669' : '#dc2626', fontWeight: 600 }}>
                {isTypingCorrect ? 'Correct!' : `Expected: ${currentCard.backText}`}
              </div>
            )}
          </Space>
        </Card>
      )}

      {studyMode === 'quiz' && (
        <Card style={{ borderRadius: 12 }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Title level={4} style={{ margin: 0 }}>Choose the best meaning</Title>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{currentCard.frontText}</div>
            <Space direction="vertical" size={8} style={{ width: '100%' }}>
              {quizOptions.map((option) => (
                <Button
                  key={option}
                  block
                  type={quizSelected === option ? 'primary' : 'default'}
                  onClick={() => setQuizSelected(option)}
                >
                  {option}
                </Button>
              ))}
            </Space>
            <Button
              onClick={() => setQuizChecked(true)}
              disabled={!quizSelected}
            >
              Check Answer
            </Button>
            {quizChecked && (
              <div style={{ color: quizSelected === currentCard.backText ? '#059669' : '#dc2626', fontWeight: 600 }}>
                {quizSelected === currentCard.backText
                  ? 'Correct!'
                  : `Correct answer: ${currentCard.backText}`}
              </div>
            )}
          </Space>
        </Card>
      )}

      {/* Action Buttons */}
      {canShowReviewButtons && (
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
              <Button type="primary" icon={<CheckCircleOutlined />} size="large" style={{ width: 120, background: '#10b981', borderColor: '#10b981' }} onClick={() => handleReview(3)}>
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
