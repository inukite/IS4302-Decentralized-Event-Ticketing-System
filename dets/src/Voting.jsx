import React, { useState } from 'react';
import './Voting.css';
import HarryStylesProfile from './HarryStylesProfile.png';
import MichaelBubleProfile from './MichaelBubleProfile.png';
import NickiMinajProfile from './NickiMinajProfile.png';
import CalumScottProfile from './CalumScottProfile.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import CountdownTimer from './CountdownToKaboom';

const UpcomingArtistCard = ({ artist, voteAllocation, onAllocateVotes }) => {
  return (
    <Col md={3} className="artist-col">
      <div className="artist-card-marketplace-voting">
        <div className="artist-image-container">
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="artist-image"
          />
        </div>
        <div className="artist-info">
          <h4 style={{ fontWeight: 'bold' }}>{artist.name}</h4>
          <p>Number of Votes:</p>
          <p style={{ color: '#6F4FF2' }}>{artist.votes}</p>
        </div>
      </div>
    </Col>
  );
};

const Voting = () => {
  const [artists, setArtists] = useState([
    {
      id: 1,
      name: 'Michael Bublé',
      votes: 130145,
      imageUrl: MichaelBubleProfile,
    },
    {
      id: 2,
      name: 'Harry Styles',
      votes: 120785,
      imageUrl: HarryStylesProfile,
    },
    { id: 3, name: 'Nicki Minaj', votes: 98633, imageUrl: NickiMinajProfile },
    { id: 4, name: 'Calum Scott', votes: 67345, imageUrl: CalumScottProfile },
  ]);

  const [loyaltyPoints, setLoyaltyPoints] = useState(54); // User's starting loyalty points
  const [votes, setVotes] = useState(
    artists.reduce((acc, artist) => {
      acc[artist.id] = 0; // Initialize with zero votes for each artist
      return acc;
    }, {})
  );
  // This function is called when the vote button for an artist is clicked
  const handleVote = (artistId, number) => {
    setVotes((prevVotes) => ({
      ...prevVotes,
      [artistId]: (prevVotes[artistId] || 0) + number,
    }));
  };

  // Handle incrementing votes before actual vote submission
  const incrementVotes = (artistId) => {
    if (loyaltyPoints > 0 && votes[artistId] < 100) {
      // Ensure user doesn't go over the max votes per artist
      setVotes({
        ...votes,
        [artistId]: votes[artistId] + 1,
      });
    }
  };

  // Handle decrementing votes
  const decrementVotes = (artistId) => {
    if (votes[artistId] > 0) {
      setVotes({
        ...votes,
        [artistId]: votes[artistId] - 1,
      });
    }
  };

  // This function is called when the "Vote Now" button is clicked
  const submitVotes = () => {
    // First, check if the user has enough points to cast all their votes
    const totalVotes = Object.values(votes).reduce(
      (acc, votes) => acc + votes,
      0
    );
    if (totalVotes > loyaltyPoints) {
      alert('You do not have enough loyalty points to cast these votes.');
      return;
    }

    // Update the artist votes
    const updatedArtists = artists.map((artist) => {
      const votesToAdd = votes[artist.id] || 0;
      return {
        ...artist,
        votes: artist.votes + votesToAdd,
      };
    });

    setArtists(updatedArtists);
    setLoyaltyPoints((points) => points - totalVotes);
    setVotes({}); // Reset the userVotes for the next round of voting
  };

  return (
    <Container>
      <CountdownTimer targetDate="2024-06-06T23:59:59" />
      <Row>
        <h2 style={{ color: '#6F4FF2', fontWeight: 'bold', padding: 20 }}>
          Vote for your favourite Artists!
        </h2>
      </Row>
      <Row className="artist-row">
        {artists.map((artist) => (
          <Col>
            <div key={artist.id} className="artist-container">
              <UpcomingArtistCard artist={artist} />
              <div className="vote-controls">
                <button
                  className="vote-button"
                  onClick={() => decrementVotes(artist.id)}
                >
                  -
                </button>
                <span className="votes-count">{votes[artist.id] || 0}</span>
                <button
                  className="vote-button"
                  onClick={() => incrementVotes(artist.id)}
                >
                  +
                </button>
              </div>
            </div>
          </Col>
        ))}
      </Row>
      <Row>
        <div className="loyalty-score">
          <h3>Loyalty Points Remaining</h3>
          <span className="loyalty-points">{loyaltyPoints}</span>
          <button className="vote-now-btn" onClick={submitVotes}>
            Vote Now
          </button>
        </div>
      </Row>
    </Container>
  );
};

export default Voting;
