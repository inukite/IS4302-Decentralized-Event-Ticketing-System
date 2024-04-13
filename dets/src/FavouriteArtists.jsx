import React from 'react';
import './ArtistScroll.css';
import BlackPinkProfile from './BlackPinkProfile.png';
import BrunoMarsProfile from './BrunoMarsProfile.png';
import EdSheeranProfile from './EdSheeranProfile.png';
import TaylorSwiftProfile from './TaylorSwiftProfile.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { useState } from 'react';
import DateFilterForMarketplace from './DateFilterForMarketplace';
import TaylorSwiftConcert from './TaylorSwiftConcert.png';
import BrunoMarsConcert from './Bruno Mars.jpg';
import EdSheeranConcert from './Ed Sheeran Asia Tour.png';
import BlackPinkConcert from './BlackPinkConcert.jpg';
import TicketsCard from './TicketsCard'; // Adjust the path as necessary
import Button from 'react-bootstrap/Button';

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

const BrunoMarsConcertTitleArray = [
  'Bruno Mars Concert',
  'Bruno Mars',
  'Bruno Mars Cat 1',
  'Bruno Mars Cat 2',
  'Bruno Mars Cat 3',
];
const TaylorSwiftConcertTitleArray = [
  'Taylor Swift Eras Tour',
  'Taylor Swift',
  'Taylor Swift Cat 1',
  'Taylor Swift Cat 2',
  'Taylor Swift Cat 3',
];
const EdSheeranConcertTitleArray = [
  'Ed Sheeran Divide Tour',
  'Ed Sheeran',
  'Ed Sheeran Cat 1',
  'Ed Sheeran Cat 2',
  'Ed Sheeran Cat 3',
];
const BlackPinkConcertTitleArray = [
  'BlackPink Born Pink Concert',
  'BlackPink',
  'BlackPink Cat 1',
  'BlackPink Cat 2',
  'BlackPink Cat 3',
];

// const buySellArray = ['buy', 'sell'];

const BrunoMarsConcertDatesArray = [
  new Date('14 Apr 2024'),
  new Date('15 Apr 2024'),
  new Date('16 Apr 2024'),
  new Date('17 Apr 2024'),
  new Date('18 Apr 2024'),
];

const TaylorSwiftConcertDatesArray = [
  new Date('1 May 2024'),
  new Date('2 May 2024'),
  new Date('3 May 2024'),
  new Date('4 May 2024'),
];

const EdSheeranConcertDatesArray = [
  new Date('15 May 2024'),
  new Date('16 May 2024'),
  new Date('17 May 2024'),
  new Date('18 May 2024'),
  new Date('19 May 2024'),
];

const BlackPinkConcertDatesArray = [
  new Date('20 Jun 2024'),
  new Date('21 Jun 2024'),
  new Date('22 Jun 2024'),
  new Date('23 Jun 2024'),
  new Date('24 Jun 2024'),
];

const sectionArray = [
  'Section A',
  'Section B',
  'Section C',
  'Section D',
  'Section E',
];

const starRatingArray = ['★★☆☆☆', '★★★☆☆', '★★★★☆', '★★★★★'];

const FavouriteArtistCard = ({ artist, onSelectArtist, isSelected }) => {
  const selectedClass = isSelected ? 'artist-card-selected' : '';

  return (
    <div
      className={`artist-card-marketplace ${selectedClass}`}
      onClick={() => onSelectArtist(artist.name)}
    >
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

const FavouriteArtists = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filter, setFilter] = useState('buy'); // 'buy' or 'sell'
  const [selectedArtist, setSelectedArtist] = useState(''); // new state for selected artist
  const [tickets, setTickets] = useState([
    // Bruno Mars Tickets
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `BM${i + 1}`,
      title:
        BrunoMarsConcertTitleArray[
          Math.floor(Math.random() * BrunoMarsConcertTitleArray.length)
        ],
      artist: 'Bruno Mars',
      date: BrunoMarsConcertDatesArray[
        Math.floor(Math.random() * BrunoMarsConcertDatesArray.length)
      ],
      category: `Cat ${(i % 3) + 1}`,
      price: Math.floor(Math.random() * 500) + 100,
      username: `themartian${Math.floor(Math.random() * 100000) + 1}`,
      // action: buySellArray[Math.floor(Math.random() * buySellArray.length)],
      action: 'buy',
      imageUrl: BrunoMarsConcert,
      numberOfTickets: Math.floor(Math.random() * 10) + 1,
      section: sectionArray[Math.floor(Math.random() * sectionArray.length)],
      seatNumber: Math.floor(Math.random() * 100) + 1,
      venue: 'National Stadium',
      starRating:
        starRatingArray[Math.floor(Math.random() * starRatingArray.length)],
      hasBeenPurchased: false,
      concertName: 'Bruno Mars Concert',
      listedForSale: false,
      myTicketsReadyToUse: false,
      myTicketsListedForSale: false,
      ticketUsed: false,
      voted: false,
      numberOfTicketsPurchased: 0,
    })),

    // Taylor Swift Tickets
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `TS${i + 1}`,
      title:
        TaylorSwiftConcertTitleArray[
          Math.floor(Math.random() * TaylorSwiftConcertTitleArray.length)
        ],
      artist: 'Taylor Swift',
      date: TaylorSwiftConcertDatesArray[
        Math.floor(Math.random() * TaylorSwiftConcertDatesArray.length)
      ],
      category: `Cat ${(i % 3) + 1}`,
      price: Math.floor(Math.random() * 500) + 100,
      username: `swiftie4eva${Math.floor(Math.random() * 100000) + 1}`,
      action: 'buy',
      imageUrl: TaylorSwiftConcert,
      numberOfTickets: Math.floor(Math.random() * 10) + 1,
      section: sectionArray[Math.floor(Math.random() * sectionArray.length)],
      seatNumber: Math.floor(Math.random() * 100) + 1,
      venue: 'National Stadium',
      starRating:
        starRatingArray[Math.floor(Math.random() * starRatingArray.length)],
      hasBeenPurchased: false,
      concertName: 'Taylor Swift Eras Tour',
      listedForSale: false,
      myTicketsReadyToUse: false,
      myTicketsListedForSale: false,
      ticketUsed: false,
      voted: false,
      numberOfTicketsPurchased: 0,
    })),

    // Ed Sheeran Tickets
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `ES${i + 1}`,
      title:
        EdSheeranConcertTitleArray[
          Math.floor(Math.random() * EdSheeranConcertTitleArray.length)
        ],
      artist: 'Ed Sheeran',
      date: EdSheeranConcertDatesArray[
        Math.floor(Math.random() * EdSheeranConcertDatesArray.length)
      ],
      category: `Cat ${(i % 3) + 1}`,
      price: Math.floor(Math.random() * 500) + 100,
      username: `ededed${Math.floor(Math.random() * 100000) + 1}`,
      action: 'buy',
      imageUrl: EdSheeranConcert,
      numberOfTickets: Math.floor(Math.random() * 10) + 1,
      section: sectionArray[Math.floor(Math.random() * sectionArray.length)],
      seatNumber: Math.floor(Math.random() * 100) + 1,
      venue: 'Singapore Indoor Stadium',
      starRating:
        starRatingArray[Math.floor(Math.random() * starRatingArray.length)],
      hasBeenPurchased: false,
      concertName: 'Ed Sheeran Divide Tour',
      listedForSale: false,
      myTicketsReadyToUse: false,
      myTicketsListedForSale: false,
      ticketUsed: false,
      voted: false,
      numberOfTicketsPurchased: 0,
    })),

    // BlackPink Tickets
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `BP${i + 1}`,
      title:
        BlackPinkConcertTitleArray[
          Math.floor(Math.random() * BlackPinkConcertTitleArray.length)
        ],
      artist: 'BlackPink',
      date: BlackPinkConcertDatesArray[
        Math.floor(Math.random() * BlackPinkConcertDatesArray.length)
      ],
      category: `Cat ${(i % 3) + 1}`,
      price: Math.floor(Math.random() * 500) + 100,
      username: `blink${Math.floor(Math.random() * 100000) + 1}`,
      action: 'buy',
      imageUrl: BlackPinkConcert,
      numberOfTickets: Math.floor(Math.random() * 10) + 1,
      section: sectionArray[Math.floor(Math.random() * sectionArray.length)],
      seatNumber: Math.floor(Math.random() * 100) + 1,
      venue: 'Star Vista',
      starRating:
        starRatingArray[Math.floor(Math.random() * starRatingArray.length)],
      hasBeenPurchased: false,
      concertName: 'BlackPink Born Pink',
      listedForSale: false,
      myTicketsReadyToUse: false,
      myTicketsListedForSale: false,
      ticketUsed: false,
      voted: false,
      numberOfTicketsPurchased: 0,
    })),

    // Hardcoded Tickets in My Tickets
    ...Array.from({ length: 1 }, (_, i) => ({
      id: 'TS20',
      title: 'Taylor Swift Eras Tour',
      artist: 'Taylor Swift',
      date: new Date('5 May 2024'),
      category: `Cat 1`,
      price: 320,
      username: `swiftie4eva${Math.floor(Math.random() * 100000) + 1}`,
      action: 'buy',
      imageUrl: TaylorSwiftConcert,
      numberOfTickets: 8,
      section: 'Section C',
      seatNumber: 20,
      venue: 'National Stadium',
      starRating: '★★★★☆',
      hasBeenPurchased: false,
      concertName: 'Taylor Swift Eras Tour',
      listedForSale: false,
      myTicketsReadyToUse: false,
      myTicketsListedForSale: false,
      ticketUsed: false,
      voted: false,
      numberOfTicketsPurchased: 0,
    })),
  ]);

  const handleDateSelect = (date) => {
    setSelectedDate(date); // Just store the selected date
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setSelectedDate(null); // Clear the selected date
  };

  const handleSelectArtist = (artistName) => {
    setSelectedArtist(artistName);
    // Optionally, you can also reset the selected date when an artist is selected
    // setSelectedDate(null);
  };

  const resetFavouriteArtists = () => {
    setSelectedArtist('');
  };

  // Function to update the purchase status
  const handlePurchase = (ticketId, numberOfTicketsPurchased) => {
    setTickets(
      tickets.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              hasBeenPurchased: true,
              numberOfTicketsPurchased: numberOfTicketsPurchased,
            }
          : ticket
      )
    );
  };

  // Combine date and availability filters
  const filteredTicketsToBuy = tickets.filter((ticket) => {
    const matchDate = selectedDate
      ? new Date(ticket.date).toDateString() === selectedDate.toDateString()
      : true;
    const matchFilter = filter === 'buy';
    const matchArtist = !selectedArtist || ticket.artist === selectedArtist; // new line
    const matchHasBeenPurchased = ticket.hasBeenPurchased === false;

    return matchDate && matchFilter && matchArtist && matchHasBeenPurchased;
  });

  const filteredTicketsToSell = tickets.filter((ticket) => {
    const matchHasBeenPurchased = ticket.hasBeenPurchased === true;
    return matchHasBeenPurchased;
  });

  // Function to shuffle an array
  function shuffleArray(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }

  // In your component before the return statement, create a shuffled array
  const shuffledTickets = shuffleArray([...filteredTicketsToBuy]);

  // Helper function to generate an array of ticket objects
  const generateTicketsWithSeatNumbers = (ticket) => {
    return Array.from(
      { length: ticket.numberOfTicketsPurchased },
      (_, index) => ({
        ...ticket, // spread the original ticket properties
        id: `${ticket.id}-seat${ticket.seatNumber + index}`, // create a unique ID for each generated ticket
        seatNumber: ticket.seatNumber + index, // increment the seat number
      })
    );
  };

  return (
    <>
      <Container>
        <DateFilterForMarketplace
          onDateSelect={handleDateSelect}
          onFilterChange={handleFilterChange}
          filter={filter}
        />
        {filter === 'buy' && (
          <>
            <Row>
              <div
                style={{
                  padding: 20,
                  display: 'flex',
                }}
              >
                <h2
                  style={{
                    color: '#6F4FF2',
                    fontWeight: 'bold',
                  }}
                >
                  Select Your Favourite Artists
                </h2>
                <Button
                  onClick={resetFavouriteArtists}
                  style={{
                    height: 35,
                    marginLeft: 20,
                    backgroundColor: '#6F4FF2',
                  }}
                >
                  Reset
                </Button>
              </div>
            </Row>
            <Row>
              <div
                className="artist-scroll-container"
                style={{
                  padding: 20,
                  marginTop: -20,
                }}
              >
                {artists.map((artist) => (
                  <FavouriteArtistCard
                    key={artist.id}
                    artist={artist}
                    onSelectArtist={handleSelectArtist}
                    isSelected={selectedArtist === artist.name}
                  />
                ))}
              </div>
            </Row>
          </>
        )}

        {filter === 'sell' ? (
          <div className="ticket-grid">
            {filteredTicketsToSell.map((ticket) => {
              const ticketsWithSeats = generateTicketsWithSeatNumbers(ticket);
              // addTicket(ticketsWithSeats);
              return ticketsWithSeats.map((ticketWithSeat) => (
                <TicketsCard key={ticketWithSeat.id} ticket={ticketWithSeat} />
              ));
            })}
          </div>
        ) : (
          <div className="ticket-grid">
            {shuffledTickets.map((ticket) => (
              <TicketsCard
                key={ticket.id}
                ticket={ticket}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}
      </Container>
    </>
  );
};

export default FavouriteArtists;
