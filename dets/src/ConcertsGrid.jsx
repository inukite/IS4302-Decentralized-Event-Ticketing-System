import React, { useState } from 'react';
import './ConcertsGrid.css'; // Your CSS file for styling
import EdSheeranAsiaTour from './Ed Sheeran Asia Tour.png';
import ColdplayWorldTour from './Coldplay World Tour.png';
import LANYConcert from './LANY Concert.jpg';
import LauvAsiaTour from './Lauv Asia Tour.jpeg';
import BrunoMars from './Bruno Mars.jpg';
import ethereumCurrency from './currency-ethereum.png';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import DateFilter from './DateFilter';
import TaylorSwiftErasTour from './TaylorSwiftConcert.png';
import IUConcert from './IUConcert.jpg';

const concerts = [
  {
    id: 1,
    name: 'Ed Sheeran Asia Tour',
    handle: '@CosmicArtisan, @Sculptor',
    date: new Date('14 Apr 2024'),
    imageUrl: EdSheeranAsiaTour,
    price: 129,
    onSale: true,
  },
  {
    id: 2,
    name: 'Taylor Swift Eras Tour',
    handle: '@SwiftieForever',
    date: new Date('25 April 2024'),
    imageUrl: TaylorSwiftErasTour,
    price: 159,
    onSale: true,
  },
  {
    id: 3,
    name: 'IU World Tour',
    handle: '@IUOfficial, @IUWorldTour',
    date: new Date('7 May 2024'),
    imageUrl: IUConcert,
    price: 149,
    onSale: true,
  },
  {
    id: 4,
    name: 'Coldplay: World Tour',
    handle: '@Robotica, @MysticInk',
    date: new Date('20 May 2024'),
    imageUrl: ColdplayWorldTour,
    price: 89,
    onSale: true,
  },
  {
    id: 5,
    name: 'LANY Concert',
    handle: '@EtherFlow, @NanoNebula',
    date: new Date('4 Aug 2024'),
    imageUrl: LANYConcert,
    price: 129,
    onSale: false,
  },
  {
    id: 6,
    name: 'Lauv: Asia Tour',
    handle: '@BinaryBard',
    date: new Date('11 Nov 2024'),
    imageUrl: LauvAsiaTour,
    price: 59,
    onSale: false,
  },
  {
    id: 7,
    name: 'Bruno Mars',
    handle: '@LunarArt, @Robotica',
    date: new Date('14 Feb 2025'),
    imageUrl: BrunoMars,
    price: 159,
    onSale: false,
  },
];

const ConcertCard = ({ concert }) => {
  return (
    <div className="concert-card-grid">
      <img
        src={concert.imageUrl}
        alt={concert.name}
        className="concert-image-grid"
      />
      <div className="concert-info-card">
        <Container>
          <Row>
            <Col>
              <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                {concert.name}
              </h4>
            </Col>
            <Col xs={4}>
              <div
                style={{
                  borderRadius: 10,
                  border: '1px solid #6F4FF2',
                  fontWeight: 'bold',
                  color: '#6F4FF2',
                  textAlign: 'center',
                }}
              >
                {concert.date.toDateString()}
              </div>
            </Col>
          </Row>

          <hr />
          <p>Tickets starting from</p>
          <div style={{ display: 'flex' }}>
            <div style={{ width: 25, height: 25 }}>
              <img src={ethereumCurrency} alt="Ethereum" />
            </div>
            <h5>${concert.price}</h5>
            <div style={{ marginLeft: 'auto' }}>
              <Button style={{ backgroundColor: '#6F4FF2' }}>
                {concert.onSale ? 'Buy Now' : 'Join Waitlist'}
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};

const ConcertsGrid = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'upcoming', or 'onSale'

  const handleDateSelect = (date) => {
    setSelectedDate(date); // Just store the selected date
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      setSelectedDate(null); // Clear the selected date
    }
  };

  // Combine date and availability filters
  const filteredConcerts = concerts.filter((concert) => {
    const matchDate = selectedDate
      ? new Date(concert.date).toDateString() === selectedDate.toDateString()
      : true;
    const matchFilter =
      filter === 'all' ||
      (filter === 'upcoming' && !concert.onSale) ||
      (filter === 'onSale' && concert.onSale);

    return matchDate && matchFilter;
  });

  return (
    <>
      <div>
        <DateFilter
          onDateSelect={handleDateSelect}
          onFilterChange={handleFilterChange}
          filter={filter}
        />
        <div
          style={{
            padding: 20,
            marginBottom: -40,
          }}
        >
          <h2
            style={{ color: '#6F4FF2', fontWeight: 'bold', paddingLeft: '5%' }}
          >
            Featured Concerts
          </h2>
        </div>
        <div
          style={{
            paddingLeft: '5%',
            paddingRight: '5%',
            // marginBottom: -40,
          }}
        >
          <div className="concerts-grid">
            {filteredConcerts.map((concert) => (
              <ConcertCard key={concert.id} concert={concert} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConcertsGrid;
