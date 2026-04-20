import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Badge, Tooltip, Dropdown, Button, Space, Tag, Typography, theme } from 'antd';
import {
  BookOutlined,
  GlobalOutlined,
  LockOutlined,
  EllipsisOutlined,
  EditOutlined,
  DeleteOutlined,
  ReadOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

const DeckCard = ({ deck, onEdit, onDelete, isOwner = false }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

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
    <Card
      hoverable
      onClick={() => navigate(`/decks/${deck.id}`)}
      style={{ borderRadius: 12, height: '100%' }}
      bodyStyle={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
        <Space align="center" size={10}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: token.colorPrimaryBg,
            }}
          >
            <BookOutlined style={{ color: token.colorPrimary, fontSize: 18 }} />
          </div>

          <Tooltip title={deck.isPublic ? 'Public deck' : 'Private deck'}>
            {deck.isPublic ? (
              <Tag icon={<GlobalOutlined />} color="blue">Public</Tag>
            ) : (
              <Tag icon={<LockOutlined />}>Private</Tag>
            )}
          </Tooltip>
        </Space>

        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </div>
      </Space>

      <div style={{ marginTop: 12, flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>
          {deck.title}
        </div>
        {deck.description ? (
          <Text type="secondary">{deck.description}</Text>
        ) : (
          <Text type="secondary">No description</Text>
        )}
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Badge count={deck.cardCount || 0} showZero overflowCount={999} />
        <Text type="secondary">{deck.cardCount === 1 ? 'card' : 'cards'}</Text>
      </div>
    </Card>
  );
};

export default DeckCard;
