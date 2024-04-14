import React from 'react';
import { useUserAddress } from './UserAddressContext';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import ConcertCardScroll from './ConcertCardScroll';
import LoyalScoreHome from './LoyaltyScoreHome';
import ArtistScroll from './ArtistCard';
import JoinCommunity from './JoinCommunity';

const Home = () => {
  const { userAddress, setUserAddress } = useUserAddress();

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
        <br />
        {/* Render LoyaltyScoreHome only if userAddress is present */}
        {userAddress && (
          <Row>
            <LoyalScoreHome />
          </Row>
        )}
        <br />
        <br />
        <Row>
          <ArtistScroll />
        </Row>
        <br />
        <br />
        <Row>
          <JoinCommunity />
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default Home;
