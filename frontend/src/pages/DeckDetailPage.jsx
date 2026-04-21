import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Spin, message, Tag, Button, Table, Tooltip, Modal, Popconfirm, Empty, Badge, Space
} from 'antd';
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReadOutlined,
  GlobalOutlined,
  LockOutlined,
  BookOutlined,
  QuestionCircleOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { deckService } from '@/services/deck.service.js';
import { flashcardService } from '@/services/flashcard.service.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import DeckFormModal from '@/components/feature/DeckFormModal.jsx';
import FlashcardFormModal from '@/components/feature/FlashcardFormModal.jsx';
import './DeckDetailPage.css';
import { speakText } from '@/utils/speech.js';

const DeckDetailPage = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [deck, setDeck] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardsLoading, setCardsLoading] = useState(false);

  const [deckModalOpen, setDeckModalOpen] = useState(false);
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const isOwner = user && deck && user.id === deck.ownerId;

  const fetchDeck = useCallback(async () => {
    try {
      const res = await deckService.getDeckById(deckId);
      if (res.success) setDeck(res.data);
    } catch (err) {
      message.error('Deck not found or access denied');
      navigate('/dashboard');
    }
  }, [deckId, navigate]);

  const fetchFlashcards = useCallback(async () => {
    setCardsLoading(true);
    try {
      const res = await flashcardService.getFlashcards(deckId);
      if (res.success) setFlashcards(res.data);
    } catch (err) {
      message.error('Failed to load flashcards');
    } finally {
      setCardsLoading(false);
    }
  }, [deckId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchDeck();
      await fetchFlashcards();
      setLoading(false);
    };
    init();
  }, [fetchDeck, fetchFlashcards]);

  // -------- Deck actions --------
  const handleUpdateDeck = async (values) => {
    setSubmitting(true);
    try {
      const res = await deckService.updateDeck(deckId, values);
      if (res.success) {
        message.success('Deck updated!');
        setDeck(res.data);
        setDeckModalOpen(false);
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  // -------- Flashcard actions --------
  const handleCreateOrUpdateCard = async (values) => {
    setSubmitting(true);
    try {
      if (editingCard) {
        const res = await flashcardService.updateFlashcard(editingCard.id, values);
        if (res.success) {
          message.success('Flashcard updated!');
          fetchFlashcards();
          setCardModalOpen(false);
          setEditingCard(null);
        }
      } else {
        const res = await flashcardService.createFlashcard(deckId, values);
        if (res.success) {
          message.success('Flashcard added!');
          fetchFlashcards();
          fetchDeck(); // update card count
          setCardModalOpen(false);
        }
      }
    } catch (err) {
      message.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    try {
      const res = await flashcardService.deleteFlashcard(cardId);
      if (res.success) {
        message.success('Flashcard deleted');
        fetchFlashcards();
        fetchDeck();
      }
    } catch (err) {
      message.error('Failed to delete flashcard');
    }
  };

  const openEditCard = (card) => {
    setEditingCard(card);
    setCardModalOpen(true);
  };

  const closeCardModal = () => {
    setCardModalOpen(false);
    setEditingCard(null);
  };

  // -------- Table columns --------
  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <span className="row-index">{index + 1}</span>
      ),
    },
    {
      title: 'Front (Word)',
      dataIndex: 'frontText',
      key: 'frontText',
      render: (text) => (
        <Space>
          <strong className="front-text">{text}</strong>
          <Tooltip title="Play pronunciation">
            <Button
              type="text"
              size="small"
              icon={<SoundOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                speakText(text);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
    {
      title: 'Back (Meaning)',
      dataIndex: 'backText',
      key: 'backText',
    },
    {
      title: 'Pronunciation',
      dataIndex: 'pronunciation',
      key: 'pronunciation',
      render: (text) => text ? <span className="ipa-text">{text}</span> : <span className="text-muted">—</span>,
    },
    {
      title: 'Part of Speech',
      dataIndex: 'partOfSpeech',
      key: 'partOfSpeech',
      render: (text) =>
        text ? (
          <Tag color="blue">{text}</Tag>
        ) : (
          <span className="text-muted">—</span>
        ),
    },
    ...(isOwner
      ? [
          {
            title: 'Actions',
            key: 'actions',
            width: 100,
            render: (_, card) => (
              <Space size="small">
                <Tooltip title="Edit">
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    size="small"
                    onClick={() => openEditCard(card)}
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete this flashcard?"
                  onConfirm={() => handleDeleteCard(card.id)}
                  okText="Delete"
                  okType="danger"
                >
                  <Tooltip title="Delete">
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      size="small"
                    />
                  </Tooltip>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!deck) return null;

  return (
    <div className="deck-detail-page">
      {/* Back button */}
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        className="back-btn"
        onClick={() => navigate('/dashboard')}
      >
        Back to Dashboard
      </Button>

      {/* Deck Header */}
      <div className="deck-detail-header">
        <div className="deck-detail-info">
          <div className="deck-detail-icon">
            <BookOutlined />
          </div>
          <div>
            <div className="deck-detail-meta">
              {deck.isPublic ? (
                <Tag icon={<GlobalOutlined />} color="blue">Public</Tag>
              ) : (
                <Tag icon={<LockOutlined />}>Private</Tag>
              )}
              <Badge count={flashcards.length} showZero style={{ backgroundColor: '#6366f1' }} />
              <span className="deck-card-count">cards</span>
            </div>
            <h1 className="deck-detail-title">{deck.title}</h1>
            {deck.description && (
              <p className="deck-detail-description">{deck.description}</p>
            )}
            {deck.ownerName && (
              <p className="deck-detail-owner">by {deck.ownerName}</p>
            )}
          </div>
        </div>

        <div className="deck-detail-actions">
          <Button
            type="primary"
            icon={<ReadOutlined />}
            size="large"
            onClick={() => navigate(`/study/${deckId}`)}
            disabled={flashcards.length === 0}
          >
            Study Now
          </Button>
          <Button
            type="primary"
            ghost
            icon={<QuestionCircleOutlined />}
            size="large"
            onClick={() => navigate(`/quiz/${deckId}`)}
            disabled={flashcards.length < 4}
            title={flashcards.length < 4 ? "Need at least 4 cards" : ""}
          >
            Take Quiz
          </Button>
          {isOwner && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => setDeckModalOpen(true)}
              >
                Edit Deck
              </Button>
              <Button
                type="dashed"
                icon={<PlusOutlined />}
                onClick={() => { setEditingCard(null); setCardModalOpen(true); }}
              >
                Add Card
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Flashcard Table */}
      <div className="flashcard-table-section">
        <div className="section-header">
          <h2 className="section-title">
            Flashcards ({flashcards.length})
          </h2>
          {isOwner && (
            <Button
              type="primary"
              ghost
              icon={<PlusOutlined />}
              onClick={() => { setEditingCard(null); setCardModalOpen(true); }}
            >
              Add Flashcard
            </Button>
          )}
        </div>

        <Table
          id="flashcards-table"
          columns={columns}
          dataSource={flashcards}
          rowKey="id"
          loading={cardsLoading}
          locale={{
            emptyText: (
              <Empty
                description={
                  isOwner
                    ? 'No flashcards yet. Add your first one!'
                    : 'This deck has no flashcards yet.'
                }
              />
            ),
          }}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `${total} cards`,
          }}
          className="flashcard-table"
        />
      </div>

      {/* Modals */}
      <DeckFormModal
        open={deckModalOpen}
        onClose={() => setDeckModalOpen(false)}
        onSubmit={handleUpdateDeck}
        initialValues={deck}
        loading={submitting}
      />

      <FlashcardFormModal
        open={cardModalOpen}
        onClose={closeCardModal}
        onSubmit={handleCreateOrUpdateCard}
        initialValues={editingCard}
        loading={submitting}
      />
    </div>
  );
};

export default DeckDetailPage;
