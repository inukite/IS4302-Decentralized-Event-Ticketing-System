import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ConcertCardScroll from './ConcertCardScroll';
import LoyalScoreHome from './LoyaltyScoreHome';

const Home = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  let navigate = useNavigate();
  const navigateToUpcomingConcerts = () => {
    let path = `/upcomingconcerts`;
    navigate(path);
  };

  return (
    <>
      <Container>
        <Row>
          <div
            style={{
              padding: 20,
            }}
          >
            <img
              src={require('./Cover Image.png')}
              style={{ width: '100%' }}
              alt="Concert"
            />
            <Button
              variant="primary"
              onClick={navigateToUpcomingConcerts} // navigate to upcomingconcerts
              style={{
                color: 'white',
                backgroundColor: '#6F4FF2',
                marginTop: '19%',
                marginLeft: '-79%',
                position: 'absolute',
              }}
            >
              Discover Now
            </Button>
          </div>
        </Row>
        <br />
        <Row>
          <div
            style={{
              padding: 20,
            }}
          >
            <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>
              Featured Concerts
            </h2>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
            }}
          ></div>
        </Row>
        <Row>
          <ConcertCardScroll />
        </Row>

        <br />
        <Row>
          <LoyalScoreHome />
        </Row>
      </Container>
    </>
  );
};

export default Home;
