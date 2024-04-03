import React from 'react';
import './ArtistScroll.css';
import BlackPinkProfile from './BlackPinkProfile.png';
import BrunoMarsProfile from './BrunoMarsProfile.png';
import EdSheeranProfile from './EdSheeranProfile.png';
import TaylorSwiftProfile from './TaylorSwiftProfile.png';

const artists = [
  {
    id: 1,
    name: 'Taylor Swift',
    handle: '@taylorswift',
    concertsCount: 4,
    imageUrl: TaylorSwiftProfile, // Make sure to use actual paths or URLs
  },
  {
    id: 2,
    name: 'Bruno Mars',
    handle: '@brunomars',
    concertsCount: 2,
    imageUrl: BrunoMarsProfile,
  },
  {
    id: 3,
    name: 'Ed Sheeran',
    handle: '@teddysphotos',
    concertsCount: 5,
    imageUrl: EdSheeranProfile,
  },
  {
    id: 4,
    name: 'BlackPink',
    handle: '@blackpinkofficial',
    concertsCount: 7,
    imageUrl: BlackPinkProfile,
  },
];

const ArtistCard = ({ artist }) => {
  return (
    <div className="artist-card">
      <div className="artist-image-container">
        <img src={artist.imageUrl} alt={artist.name} className="artist-image" />
      </div>
      <div className="artist-info">
        <h4 style={{ fontWeight: 'bold' }}>{artist.name}</h4>
        <p>{artist.handle}</p>
        <p style={{ color: '#6F4FF2' }}>
          {artist.concertsCount} Upcoming Concerts
        </p>
      </div>
    </div>
  );
};

const ArtistScroll = () => {
  return (
    <>
      <div style={{ padding: 20 }}>
        <div>
          <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>
            Select Your Favourite Artists
          </h2>
        </div>

        <div className="artist-scroll-container">
          {artists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </div>
    </>
  );
};

export default ArtistScroll;
