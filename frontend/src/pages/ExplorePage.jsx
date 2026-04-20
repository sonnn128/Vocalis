import React from 'react';
import { Card, Empty, Typography } from 'antd';

const { Title, Paragraph } = Typography;

const ExplorePage = () => {
  return (
    <Card style={{ borderRadius: 12 }}>
      <Title level={3} style={{ marginTop: 0 }}>Explore</Title>
      <Paragraph style={{ marginBottom: 24 }}>
        Public decks will appear here.
      </Paragraph>
      <Empty description="No public decks yet" />
    </Card>
  );
};

export default ExplorePage;
