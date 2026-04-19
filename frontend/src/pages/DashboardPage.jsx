import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Empty, message, Modal, Spin, Input, Select, Pagination } from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  AppstoreOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { deckService } from '@/services/deck.service.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import DeckCard from '@/components/feature/DeckCard.jsx';
import DeckFormModal from '@/components/feature/DeckFormModal.jsx';

const { Search } = Input;

const DashboardPage = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ current: 0, total: 0, pageSize: 20 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  // Open create modal when ?create=true
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setModalOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, []);

  const fetchDecks = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const res = await deckService.getMyDecks(page, pagination.pageSize);
      if (res.success) {
        const { content, totalElements } = res.data;
        setDecks(content);
        setPagination((prev) => ({ ...prev, current: page, total: totalElements }));
      }
    } catch (err) {
      message.error('Failed to load your decks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDecks(0);
  }, [fetchDecks]);

  const handleCreateOrUpdate = async (values) => {
    setSubmitting(true);
    try {
      if (editingDeck) {
        const res = await deckService.updateDeck(editingDeck.id, values);
        if (res.success) {
          message.success('Deck updated successfully!');
          fetchDecks(pagination.current);
        } else {
          message.error(res.message || 'Failed to update deck');
        }
      } else {
        const res = await deckService.createDeck(values);
        if (res.success) {
          message.success('Deck created successfully!');
          fetchDecks(0);
        } else {
          message.error(res.message || 'Failed to create deck');
        }
      }
      setModalOpen(false);
      setEditingDeck(null);
    } catch (err) {
      message.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (deck) => {
    setEditingDeck(deck);
    setModalOpen(true);
  };

  const handleDelete = (deck) => {
    Modal.confirm({
      title: 'Delete Deck',
      content: (
        <span>
          Are you sure you want to delete <strong>{deck.title}</strong>?
          This will also delete all {deck.cardCount} flashcard(s) inside.
        </span>
      ),
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const res = await deckService.deleteDeck(deck.id);
          if (res.success) {
            message.success('Deck deleted');
            fetchDecks(0);
          }
        } catch (err) {
          message.error('Failed to delete deck');
        }
      },
    });
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingDeck(null);
  };

  return (
    <div className="dashboard-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">My Decks</h1>
          <p className="page-subtitle">
            {pagination.total} deck{pagination.total !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <button
          id="create-deck-btn"
          className="btn-primary"
          onClick={() => { setEditingDeck(null); setModalOpen(true); }}
        >
          <PlusOutlined /> New Deck
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : decks.length === 0 ? (
        <div className="empty-state">
          <Empty
            description={
              <span>
                You have no decks yet.{' '}
                <button
                  className="link-btn"
                  onClick={() => { setEditingDeck(null); setModalOpen(true); }}
                >
                  Create your first deck!
                </button>
              </span>
            }
          />
        </div>
      ) : (
        <>
          <div className="decks-grid">
            {decks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                isOwner={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {pagination.total > pagination.pageSize && (
            <div className="pagination-wrapper">
              <Pagination
                current={pagination.current + 1}
                total={pagination.total}
                pageSize={pagination.pageSize}
                onChange={(page) => fetchDecks(page - 1)}
                showTotal={(total) => `Total ${total} decks`}
              />
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <DeckFormModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateOrUpdate}
        initialValues={editingDeck}
        loading={submitting}
      />
    </div>
  );
};

export default DashboardPage;
