import React from 'react';
// import ProgressBar from '@ramonak/react-progress-bar';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const LoyalScoreHome = () => {
  return (
    <>
      <div
        style={{
          padding: 20,
          borderRadius: 10,
          border: '1px solid #6F4FF2',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Container>
          <Row>
            <Col></Col>
            <Col>
              <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>
                My Loyalty Score
              </h2>
            </Col>
            <Col>
              <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>54 LP</h2>
            </Col>
            <Col></Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <p>Collect points to unlock rewards!</p>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default LoyalScoreHome;
