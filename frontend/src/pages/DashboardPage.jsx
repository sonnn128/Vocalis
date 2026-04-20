import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button, Card, Col, Empty, message, Modal, Row, Space, Spin, Typography, Pagination } from 'antd';
import {
  PlusOutlined,
} from '@ant-design/icons';
import { deckService } from '@/services/deck.service.js';
import DeckCard from '@/components/feature/DeckCard.jsx';
import DeckFormModal from '@/components/feature/DeckFormModal.jsx';

const { Title, Text } = Typography;

const DashboardPage = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pagination, setPagination] = useState({ current: 0, total: 0, pageSize: 20 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

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
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card style={{ borderRadius: 12 }}>
          <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
            <div>
              <Title level={3} style={{ marginTop: 0, marginBottom: 4 }}>My Decks</Title>
              <Text type="secondary">
                {pagination.total} deck{pagination.total !== 1 ? 's' : ''} in your library
              </Text>
            </div>
            <Button
              id="create-deck-btn"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => { setEditingDeck(null); setModalOpen(true); }}
            >
              New Deck
            </Button>
          </Space>
        </Card>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 48 }}>
            <Spin size="large" />
          </div>
        ) : decks.length === 0 ? (
          <Card style={{ borderRadius: 12 }}>
            <Empty
              description={
                <span>
                  You have no decks yet.{' '}
                  <a onClick={() => { setEditingDeck(null); setModalOpen(true); }}>
                    Create your first deck
                  </a>
                  .
                </span>
              }
            />
          </Card>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {decks.map((deck) => (
                <Col key={deck.id} xs={24} sm={12} lg={8}>
                  <DeckCard
                    deck={deck}
                    isOwner={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </Col>
              ))}
            </Row>

            {pagination.total > pagination.pageSize && (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 24px' }}>
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
      </Space>

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
