import React from 'react';
import './TicketsCard.css'; // Your CSS file for styling
import ethereumCurrency from './currency-ethereum.png';
import Button from 'react-bootstrap/Button';
import sellerProfilePicture from './sellerProfilePicture.png';

const TicketCard = ({ ticket }) => {
  return (
    <div className="ticket-card-home">
      <img src={ticket.imageUrl} alt={ticket.name} className="cards" />
      <div className="ticket-info-home">
        <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>{ticket.title}</h4>
        <div
          style={{
            display: 'flex',
          }}
        >
          <div style={{ width: 25, height: 25, marginRight: 10 }}>
            <img
              src={sellerProfilePicture}
              alt="Seller"
              style={{ width: 30, height: 30 }}
            />
          </div>
          <h6 style={{ alignContent: 'center', alignItems: 'center' }}>
            @ {ticket.username}
          </h6>
        </div>
        <hr />
        {/* <p>Tickets starting from</p> */}
        <div style={{ display: 'flex' }}>
          <div style={{ width: 25, height: 25 }}>
            <img src={ethereumCurrency} alt="Ethereum" />
          </div>
          <h5>${ticket.price}</h5>
          <div style={{ marginLeft: 'auto' }}>
            <Button style={{ backgroundColor: '#6F4FF2' }}> Buy Now </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
