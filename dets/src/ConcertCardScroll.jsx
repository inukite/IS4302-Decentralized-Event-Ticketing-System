import React from 'react';
import './ConcertCardScroll.css'; // Your CSS file for styling
import EdSheeranAsiaTour from './Ed Sheeran Asia Tour.png';
import ColdplayWorldTour from './Coldplay World Tour.png';
import LANYConcert from './LANY Concert.jpg';
import LauvAsiaTour from './Lauv Asia Tour.jpeg';
import BrunoMars from './Bruno Mars.jpg';
import ethereumCurrency from './currency-ethereum.png';
import Button from 'react-bootstrap/Button';

const concerts = [
  {
    id: 1,
    name: 'Ed Sheeran Asia Tour',
    handle: '@CosmicArtisan, @Sculptor',
    date: '8',
    imageUrl: EdSheeranAsiaTour,
    price: 129,
  },
  {
    id: 2,
    name: 'Coldplay: World Tour',
    handle: '@Robotica, @MysticInk',
    date: '20',
    imageUrl: ColdplayWorldTour,
    price: 89,
  },
  {
    id: 3,
    name: 'LANY Concert',
    handle: '@EtherFlow, @NanoNebula',
    date: '26',
    imageUrl: LANYConcert,
    price: 129,
  },
  {
    id: 4,
    name: 'Lauv: Asia Tour',
    handle: '@BinaryBard',
    date: '30',
    imageUrl: LauvAsiaTour,
    price: 59,
  },
  {
    id: 5,
    name: 'Bruno Mars',
    handle: '@LunarArt, @Robotica',
    date: '31',
    imageUrl: BrunoMars,
    price: 159,
  },
];

const ConcertCard = ({ concert }) => {
  return (
    <div className="concert-card-home">
      <img src={concert.imageUrl} alt={concert.name} className="cards" />
      <div className="concert-info-home">
        <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>{concert.name}</h4>
        <hr />
        <p>Tickets starting from</p>
        <div style={{ display: 'flex' }}>
          <div style={{ width: 25, height: 25 }}>
            <img src={ethereumCurrency} alt="Ethereum" />
          </div>
          <h5>${concert.price}</h5>
          <div style={{ marginLeft: 'auto' }}>
            <Button style={{ backgroundColor: '#6F4FF2' }}> Buy Now </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConcertCardScroll = () => {
  return (
    <div className="concert-card-scroll">
      {concerts.map((concert) => (
        <ConcertCard key={concert.id} concert={concert} />
      ))}
    </div>
  );
};

export default ConcertCardScroll;
