import React from 'react';
import { List, Typography, Card } from 'antd';  // Ensure correct imports

const { Title, Text } = Typography;

interface BidRecommendationsProps {
  suggestedBidsByType: Record<string, number[]>;
}

const BidRecommendations: React.FC<BidRecommendationsProps> = ({ suggestedBidsByType }) => {
  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#f7f7f7' }}>
      <Card 
        title={<Title level={2} style={{ textAlign: 'center', fontWeight: 'bold' }}>Bid Recommendations</Title>} 
        bordered={false} 
        style={{ boxShadow: '0 6px 20px rgba(0,0,0,0.1)', borderRadius: '12px', backgroundColor: '#fff' }}
      >
        {Object.entries(suggestedBidsByType).map(([type, bids]) => (
          <Card
            key={type}
            type="inner"
            title={<Text strong style={{ fontSize: '18px', color: '#333' }}>{type}</Text>}
            style={{
              marginBottom: '20px',
              backgroundColor: '#fafafa',
              borderRadius: '12px',
              border: '1px solid #ddd',
              padding: '16px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            <List
              size="small"
              dataSource={bids}
              renderItem={(bid, index) => (
                <List.Item 
                  key={index} 
                  style={{
                    padding: '12px 20px', 
                    backgroundColor: '#fff', 
                    borderRadius: '8px', 
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)', 
                    marginBottom: '8px',
                  }}
                >
                  <Text style={{ fontSize: '16px', color: '#555' }}>Suggested Bid: {bid}</Text>
                </List.Item>
              )}
            />
          </Card>
        ))}
      </Card>
    </div>
  );
};

export default BidRecommendations;
