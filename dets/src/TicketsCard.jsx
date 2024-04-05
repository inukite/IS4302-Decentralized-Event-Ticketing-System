import React, { useState } from 'react';
import './TicketsCard.css'; // Your CSS file for styling
import ethereumCurrency from './currency-ethereum.png';
import Button from 'react-bootstrap/Button';
import sellerProfilePicture from './sellerProfilePicture.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const TicketCard = ({ ticket }) => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle showing and hiding of the modal
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const [ticketDetails, setTicketDetails] = useState({
    ticketDate: '',
    ticketCategory: '',
    numberOfTickets: '',
    seatSection: '',
  });

  const handleChange = (name, value) => {
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleBuyTicket = () => {
    const { ticketDate, ticketCategory, numberOfTickets, seatSection } =
      ticketDetails;

    // Simple front-end validation
    if (!ticketDate || !ticketCategory || !numberOfTickets || !seatSection) {
      alert('Please select all options');
      return;
    } else {
      setToastMessage('Ticket(s) purchased successfully!');
    }

    // If validation is successful
    setShowModal(false); // Close the modal
    setShowToast(true); // Show success toast

    // Reset form fields after purchase
    setTicketDetails({
      ticketDate: '',
      ticketCategory: '',
      numberOfTickets: '',
      seatSection: '',
    });
  };

  const formatDateWithoutWeekday = (dateString) => {
    const parts = new Date(dateString).toDateString().split(' ');
    return `${parts[2]} ${parts[1]} ${parts[3]}`; // This will format it as "month day year"
  };

  return (
    <>
      <ToastContainer
        className="p-3"
        position="middle-center"
        style={{ position: 'fixed' }}
      >
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Success</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <div className="ticket-card-home">
        <img src={ticket.imageUrl} alt={ticket.name} className="cards" />
        <div className="ticket-info-home">
          <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
            {ticket.title}
          </h4>
          <Container>
            <Row>
              <Col xs={1}>
                <div style={{ width: 25, height: 25, paddingRight: 5 }}>
                  <img
                    src={sellerProfilePicture}
                    alt="Seller"
                    style={{ width: 30, height: 30 }}
                  />
                </div>
              </Col>
              <Col xs={6}>
                <h6
                  style={{
                    alignContent: 'flex-start',
                    alignItems: 'flex-start',
                    fontSize: 15,
                    paddingLeft: 5,
                    paddingTop: 5,
                  }}
                >
                  @{ticket.username}
                </h6>
              </Col>
              <Col xs={5}>
                <div
                  style={{
                    borderRadius: 10,
                    border: '1px solid #6F4FF2',
                    fontWeight: 'bold',
                    color: '#6F4FF2',
                    textAlign: 'center',
                    alignContent: 'end',
                    alignItems: 'end',
                  }}
                >
                  {formatDateWithoutWeekday(ticket.date)}
                </div>
              </Col>
            </Row>
          </Container>
          <hr />
          <div style={{ display: 'flex' }}>
            <div style={{ width: 25, height: 25 }}>
              <img src={ethereumCurrency} alt="Ethereum" />
            </div>
            <h5>${ticket.price}</h5>
            <div style={{ marginLeft: 'auto' }}>
              <Button
                style={{ backgroundColor: '#6F4FF2' }}
                onClick={handleShowModal}
              >
                {' '}
                Buy Now{' '}
              </Button>
              <Modal
                show={showModal}
                onHide={handleCloseModal}
                centered
                size="xl"
              >
                <Modal.Body>
                  <Container>
                    <Row>
                      <img
                        src={ticket.imageUrl}
                        alt={ticket.name}
                        style={{ width: '100%', padding: 20 }}
                      />
                    </Row>
                    <Row>
                      <Col>
                        <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>
                          {ticket.name}
                        </h2>
                        <h5>{ticket.venue}</h5>{' '}
                        <Form>
                          <Form.Group style={{ marginRight: 20 }}>
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                              as="select"
                              value={ticketDetails.ticketDate}
                              onChange={(e) =>
                                handleChange('ticketDate', e.target.value)
                              }
                            >
                              <option value="">Select a date</option>
                              <option value={ticket.date.toDateString()}>
                                {ticket.date.toDateString()}
                              </option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group style={{ marginRight: 20 }}>
                            <Form.Label>Ticket Category</Form.Label>
                            <Form.Control
                              as="select"
                              value={ticketDetails.ticketCategory}
                              onChange={(e) =>
                                handleChange('ticketCategory', e.target.value)
                              }
                            >
                              <option value="">Select a category</option>
                              <option value="cat 1">{ticket.category}</option>
                            </Form.Control>
                          </Form.Group>
                          <Form.Group style={{ marginRight: 20 }}>
                            <Form.Label>Number of Tickets</Form.Label>
                            <Form.Control
                              as="select"
                              value={ticketDetails.numberOfTickets}
                              onChange={(e) =>
                                handleChange('numberOfTickets', e.target.value)
                              }
                            >
                              <option value="">Choose a number</option>
                              {Array.from(
                                { length: ticket.numberOfTickets },
                                (_, i) => (
                                  <option key={i + 1} value={i + 1}>
                                    {i + 1}
                                  </option>
                                )
                              )}
                            </Form.Control>
                          </Form.Group>
                          <Form.Group style={{ marginRight: 20 }}>
                            <Form.Label>Seat Section</Form.Label>
                            <Form.Control
                              as="select"
                              value={ticketDetails.seatSection}
                              onChange={(e) =>
                                handleChange('seatSection', e.target.value)
                              }
                            >
                              <option value="">Choose a section</option>
                              <option value="section">{ticket.section}</option>
                            </Form.Control>
                          </Form.Group>
                        </Form>
                      </Col>
                    </Row>
                  </Container>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleBuyTicket}>
                    Buy Ticket
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TicketCard;
