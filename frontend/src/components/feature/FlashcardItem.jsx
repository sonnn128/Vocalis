import React, { useState } from 'react';
import { Card, Typography, Tag, Divider } from 'antd';
import { SoundOutlined } from '@ant-design/icons';
import './FlashcardItem.css';

const { Title, Paragraph } = Typography;

const FlashcardItem = ({ card, isFlipped, onFlip }) => {
  if (!card) return null;

  const playAudio = (e) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.frontText);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className={`flip-card-container ${isFlipped ? 'flipped' : ''}`} onClick={onFlip}>
      <div className="flip-card-inner">
        {/* Front Side */}
        <Card className="flip-card-front" hoverable>
          <div className="card-content-wrapper">
            <Title level={2} className="card-front-text">
              {card.frontText}
              <SoundOutlined className="audio-icon" onClick={playAudio} />
            </Title>
            {card.pronunciation && (
              <span className="card-ipa">/{card.pronunciation}/</span>
            )}
            <div className="flip-hint">Click to flip</div>
          </div>
        </Card>

        {/* Back Side */}
        <Card className="flip-card-back">
          <div className="card-content-wrapper">
            <div className="card-header-back">
              <Title level={3} className="card-back-text">{card.frontText}</Title>
              {card.partOfSpeech && (
                <Tag color="blue" className="pos-tag">{card.partOfSpeech}</Tag>
              )}
            </div>
            
            <Divider className="card-divider" />
            
            <div className="card-meaning-group">
              <div className="meaning-label">Meaning:</div>
              <Paragraph className="card-meaning">
                {card.backText}
              </Paragraph>
            </div>
            
            {card.example && (
              <div className="card-example-group">
                 <div className="meaning-label">Example:</div>
                 <Paragraph className="card-example">
                   "{card.example}"
                 </Paragraph>
              </div>
            )}
            
            <div className="flip-hint" style={{ marginTop: 'auto' }}>Click to flip back</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FlashcardItem;
