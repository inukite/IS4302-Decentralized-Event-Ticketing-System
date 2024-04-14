import React, { useState } from 'react';
import './JoinCommunity.css'; // Make sure to create this CSS file
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

const JoinCommunity = () => {
  return (
    <>
      <section className="join-community">
        <div className="community-content">
          <Container>
            <Row>
              <Col md="auto">
                <div className="community-image">
                  <img
                    src={require('./JoinCommunityPicture.png')}
                    alt="Community Image"
                  />
                </div>
              </Col>
              <Col style={{ alignContent: 'center' }}>
                <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>
                  Join Our Community
                </h2>
                <p>
                  Sign up now to get the latest updates on any of your favourite
                  concerts coming to your area!
                </p>
                <form>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />
                  <button style={{ backgroundColor: '#6F4FF2' }} type="submit">
                    Get Email
                  </button>
                </form>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
    </>
  );
};

export default JoinCommunity;
