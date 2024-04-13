import React, { useState } from 'react';
// import { useUserAddress } from './UserAddressContext';
import TicketsCard from './TicketsCard';
import TaylorSwiftConcert from './TaylorSwiftConcert.png';

const MyTickets = ({ ticketsStorage }) => {
  // const { userAddress, setUserAddress } = useUserAddress();

  const [ticketsOwned, setTicketsOwned] = useState([
    // Taylor Swift Tickets
    ...Array.from({ length: 3 }, (_, i) => ({
      id: `TS${i + 1}`,
      title: 'Taylor Swift Eras Tour',
      artist: 'Taylor Swift',
      date: new Date('5 May 2024'),
      category: `Cat 1`,
      price: 320,
      username: `swiftie4eva${Math.floor(Math.random() * 100000) + 1}`,
      action: 'buy',
      imageUrl: TaylorSwiftConcert,
      numberOfTickets: Math.floor(Math.random() * 10) + 1,
      section: 'Section C',
      seatNumber: 20 + i,
      venue: 'National Stadium',
      starRating: '★★★★☆',
      hasBeenPurchased: true,
      concertName: 'Taylor Swift Eras Tour',
      listedForSale: false,
      myTicketsReadyToUse: true,
      myTicketsListedForSale: false,
      ticketUsed: false,
      voted: false,
    })),
  ]);

  const [ticketsListedForSale, setTicketsListedForSale] = useState([
    // Taylor Swift Tickets
    ...Array.from({ length: 1 }, (_, i) => ({
      id: `TS${i + 3}`,
      title: 'Taylor Swift Eras Tour',
      artist: 'Taylor Swift',
      date: new Date('5 May 2024'),
      category: `Cat 1`,
      price: 320,
      username: `swiftie4eva${Math.floor(Math.random() * 100000) + 1}`,
      action: 'buy',
      imageUrl: TaylorSwiftConcert,
      numberOfTickets: Math.floor(Math.random() * 10) + 1,
      section: 'Section C',
      seatNumber: 23,
      venue: 'National Stadium',
      starRating: '★★★★☆',
      hasBeenPurchased: true,
      concertName: 'Taylor Swift Eras Tour',
      listedForSale: true,
      myTicketsReadyToUse: false,
      myTicketsListedForSale: true,
      ticketUsed: false,
      voted: false,
    })),
  ]);

  // Function to update the purchase status
  const handleUseTicket = (ticketId) => {
    setTicketsOwned(
      ticketsOwned.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ticketUsed: true } : ticket
      )
    );
  };

  // Function to update the purchase status
  const handleVoting = (ticketId) => {
    setTicketsOwned(
      ticketsOwned.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, voted: true } : ticket
      )
    );
  };

  return (
    <>
      <div
        style={{
          padding: 20,
          marginBottom: -40,
        }}
      >
        <h2 style={{ color: '#6F4FF2', fontWeight: 'bold', paddingLeft: '5%' }}>
          My Tickets
        </h2>
      </div>
      <div
        className="ticket-grid"
        style={{ paddingLeft: 50, paddingRight: 50 }}
      >
        {ticketsOwned.map((ticket) => (
          <TicketsCard
            key={ticket.id}
            ticket={ticket}
            onUsageOfTicket={handleUseTicket}
            onVoting={handleVoting}
          />
        ))}
      </div>
      <div
        style={{
          padding: 20,
          marginBottom: -40,
        }}
      >
        <h2 style={{ color: '#6F4FF2', fontWeight: 'bold', paddingLeft: '5%' }}>
          Listed For Sale
        </h2>
      </div>
      <div
        className="ticket-grid"
        style={{ paddingLeft: 50, paddingRight: 50 }}
      >
        {ticketsListedForSale.map((ticket) => (
          <TicketsCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
    </>
  );
};

export default MyTickets;
