import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Tooltip, Dropdown, Button } from 'antd';
import {
  BookOutlined,
  GlobalOutlined,
  LockOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ReadOutlined,
} from '@ant-design/icons';

const DeckCard = ({ deck, onEdit, onDelete, isOwner = false }) => {
  const navigate = useNavigate();

  const menuItems = isOwner
    ? [
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: 'Edit Deck',
          onClick: (e) => {
            e.domEvent.stopPropagation();
            onEdit(deck);
          },
        },
        {
          key: 'study',
          icon: <ReadOutlined />,
          label: 'Study Now',
          onClick: (e) => {
            e.domEvent.stopPropagation();
            navigate(`/study/${deck.id}`);
          },
        },
        { type: 'divider' },
        {
          key: 'delete',
          icon: <DeleteOutlined />,
          label: 'Delete',
          danger: true,
          onClick: (e) => {
            e.domEvent.stopPropagation();
            onDelete(deck);
          },
        },
      ]
    : [
        {
          key: 'study',
          icon: <ReadOutlined />,
          label: 'Study Now',
          onClick: (e) => {
            e.domEvent.stopPropagation();
            navigate(`/study/${deck.id}`);
          },
        },
      ];

  return (
    <div
      className="deck-card"
      onClick={() => navigate(`/decks/${deck.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/decks/${deck.id}`)}
    >
      <div className="deck-card-header">
        <div className="deck-icon">
          <BookOutlined />
        </div>
        <div className="deck-visibility">
          <Tooltip title={deck.isPublic ? 'Public deck' : 'Private deck'}>
            {deck.isPublic ? (
              <GlobalOutlined className="visibility-icon public" />
            ) : (
              <LockOutlined className="visibility-icon private" />
            )}
          </Tooltip>
        </div>
      </div>

      <div className="deck-card-body">
        <h3 className="deck-title">{deck.title}</h3>
        {deck.description && (
          <p className="deck-description">{deck.description}</p>
        )}
      </div>

      <div className="deck-card-footer">
        <Badge
          count={deck.cardCount || 0}
          showZero
          style={{ backgroundColor: '#6366f1' }}
          overflowCount={999}
        />
        <span className="card-count-label">
          {deck.cardCount === 1 ? 'card' : 'cards'}
        </span>

        <div className="deck-actions" onClick={(e) => e.stopPropagation()}>
          <Dropdown
            menu={{ items: menuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              icon={<EllipsisOutlined />}
              size="small"
              className="deck-menu-btn"
            />
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default DeckCard;
