import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Col, Progress, Radio, Row, Space, Spin, Typography, message, Result } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { studyService } from '@/services/study.service.js';
import { deckService } from '@/services/deck.service.js';

const { Title, Text, Paragraph } = Typography;

const QuizPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        setLoading(true);
        const [deckRes, quizRes] = await Promise.all([
          deckService.getDeckById(deckId),
          studyService.getQuizCards(deckId, 10)
        ]);
        
        if (deckRes.success) setDeck(deckRes.data);
        if (quizRes.success) {
          if (quizRes.data && quizRes.data.length >= 4) {
            setCards(quizRes.data);
          } else {
            message.warning('Not enough cards in this deck to create a quiz. Needs at least 4.');
            navigate(`/decks/${deckId}`);
          }
        }
      } catch (err) {
        message.error('Failed to load quiz');
        navigate(`/decks/${deckId}`);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [deckId, navigate]);

  const currentOptions = useMemo(() => {
    if (!cards || cards.length === 0 || currentIndex >= cards.length) return [];
    
    const correctCard = cards[currentIndex];
    const options = [correctCard];
    
    // Pick 3 random wrong options
    const wrongOptions = cards.filter(c => c.id !== correctCard.id);
    const shuffledWrong = wrongOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
    
    const allOptions = [...options, ...shuffledWrong];
    return allOptions.sort(() => 0.5 - Math.random());
  }, [cards, currentIndex]);

  const handleSelectOption = (e) => {
    if (isAnswered) return;
    setSelectedOption(e.target.value);
  };

  const handleSubmitAnswer = () => {
    if (!selectedOption) return;
    
    setIsAnswered(true);
    const currentCard = cards[currentIndex];
    
    if (selectedOption === currentCard.id) {
      setScore(prev => prev + 1);
      message.success('Correct!');
    } else {
      message.error('Incorrect!');
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedOption(null);
    
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setFinished(true);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Spin size="large" tip="Generating your quiz..." />
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / cards.length) * 100);
    return (
      <div style={{ maxWidth: 800, margin: '40px auto' }}>
        <Card style={{ borderRadius: 12, textAlign: 'center', padding: '40px 20px' }}>
          <Result
            status={percentage >= 50 ? "success" : "warning"}
            title="Quiz Completed!"
            subTitle={`You scored ${score} out of ${cards.length} (${percentage}%)`}
            extra={[
              <Button type="primary" key="console" onClick={() => navigate(`/decks/${deckId}`)}>
                Back to Deck
              </Button>,
              <Button key="buy" onClick={() => window.location.reload()}>
                Try Again
              </Button>,
            ]}
          />
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentIndex];
  const progressPercent = Math.round((currentIndex / cards.length) * 100);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate(`/decks/${deckId}`)}
        >
          Exit Quiz
        </Button>
        <div style={{ fontWeight: 600, color: '#4b5563' }}>
          Question {currentIndex + 1} of {cards.length}
        </div>
      </div>
      
      <Progress percent={progressPercent} showInfo={false} strokeColor="#6366f1" style={{ marginBottom: 32 }} />

      <Card style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32, padding: '20px 0' }}>
          <Text type="secondary" style={{ fontSize: 16, textTransform: 'uppercase', letterSpacing: 1 }}>What is the meaning of:</Text>
          <Title level={2} style={{ marginTop: 8, color: '#111827' }}>{currentCard.frontText}</Title>
          {currentCard.frontImageUrl && (
            <img src={currentCard.frontImageUrl} alt="Flashcard visual" style={{ maxWidth: '100%', maxHeight: 200, marginTop: 16, borderRadius: 8 }} />
          )}
        </div>

        <Radio.Group onChange={handleSelectOption} value={selectedOption} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {currentOptions.map((opt) => {
            const isCorrect = isAnswered && opt.id === currentCard.id;
            const isWrongSelected = isAnswered && selectedOption === opt.id && opt.id !== currentCard.id;
            
            let borderColor = '#d1d5db';
            let bgColor = 'white';
            
            if (isCorrect) {
              borderColor = '#10b981'; // green
              bgColor = '#ecfdf5';
            } else if (isWrongSelected) {
              borderColor = '#ef4444'; // red
              bgColor = '#fef2f2';
            } else if (selectedOption === opt.id) {
              borderColor = '#6366f1';
              bgColor = '#eef2ff';
            }

            return (
              <label 
                key={opt.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '16px 20px', 
                  border: `2px solid ${borderColor}`, 
                  borderRadius: 8, 
                  cursor: isAnswered ? 'default' : 'pointer',
                  backgroundColor: bgColor,
                  transition: 'all 0.2s'
                }}
                onClick={() => { if(!isAnswered && selectedOption !== opt.id) setSelectedOption(opt.id); }}
              >
                <Radio value={opt.id} disabled={isAnswered} style={{ marginRight: 16 }} />
                <span style={{ fontSize: 16, flex: 1 }}>{opt.backText}</span>
                {isCorrect && <CheckCircleOutlined style={{ color: '#10b981', fontSize: 20 }} />}
                {isWrongSelected && <CloseCircleOutlined style={{ color: '#ef4444', fontSize: 20 }} />}
              </label>
            );
          })}
        </Radio.Group>

        <div style={{ marginTop: 32, textAlign: 'right' }}>
          {!isAnswered ? (
            <Button type="primary" size="large" onClick={handleSubmitAnswer} disabled={!selectedOption} style={{ width: 140 }}>
              Check Answer
            </Button>
          ) : (
            <Button type="primary" size="large" onClick={handleNextQuestion} style={{ width: 140 }}>
              Next Question
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuizPage;
