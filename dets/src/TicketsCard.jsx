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

const TicketCard = ({ ticket, onPurchase, onUsageOfTicket, onVoting }) => {
  const [showModal, setShowModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [ticketListed, setTicketListed] = useState(false);
  const [numberOfTicketsPurchased, setNumberOfTicketsPurchased] = useState(0);
  const [showModalForUsingTicket, setShowModalForUsingTicket] = useState(false);
  const [showToastForUsingTicket, setShowToastForUsingTicket] = useState(false);
  const [toastMessageForUsingTicket, setToastMessageForUsingTicket] =
    useState('');
  const [showModalForEncoreSongVoting, setShowModalForEncoreSongVoting] =
    useState(false);
  const [showToastForEncoreSongVoting, setShowToastForEncoreSongVoting] =
    useState(false);
  const [toastMessageForEncoreSongVoting, setToastMessageForEncoreSongVoting] =
    useState('');

  // Handle showing and hiding of the modal
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => {
    if (ticketListed) {
      setTicketListed(false);
    } else {
      setShowModal(true);
    }
  };

  // For using ticket
  const handleCloseModalForUsingTicket = () =>
    setShowModalForUsingTicket(false);
  const handleShowModalForUsingTicket = () => {
    if (ticketListed) {
      setTicketListed(false);
    } else {
      setShowModalForUsingTicket(true);
    }
  };

  // For voting for encore song
  const handleCloseModalForEncoreSongVoting = () =>
    setShowModalForEncoreSongVoting(false);
  const handleShowModalForEncoreSongVoting = () => {
    if (ticketListed) {
      setTicketListed(false);
    } else {
      setShowModalForEncoreSongVoting(true);
    }
  };

  const [ticketDetails, setTicketDetails] = useState({
    ticketDate: '',
    ticketCategory: '',
    numberOfTickets: '',
    seatSection: '',
    seatNumber: '',
    sellingPrice: '',
  });

  const handleChange = (name, value) => {
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleChangeForNumberOfTickets = (name, value) => {
    setTicketDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setNumberOfTicketsPurchased(value);
  };

  const handleBuyTicket = () => {
    const {
      ticketDate,
      ticketCategory,
      numberOfTickets,
      seatSection,
      // seatNumber,
      // sellingPrice,
    } = ticketDetails;

    // Simple front-end validation
    if (
      !ticketDate ||
      !ticketCategory ||
      !numberOfTickets ||
      !seatSection
      // !seatNumber ||
      // !sellingPrice
    ) {
      alert('Please select all options');
      return;
    } else {
      setToastMessage('Ticket(s) purchased successfully!');
    }

    // If validation is successful
    setShowModal(false); // Close the modal
    setShowToast(true); // Show success toast

    // Delay the purchase handling to allow the toast to show
    setTimeout(() => {
      // Call the function passed from the parent component to update the ticket status
      onPurchase(ticket.id, ticketDetails.numberOfTickets);
    }, 3000); // 500ms delay

    // Reset form fields after a slight delay to ensure state update happens after the toast is shown
    setTimeout(() => {
      setTicketDetails({
        ticketDate: '',
        ticketCategory: '',
        numberOfTickets: '',
        seatSection: '',
      });
    }, 1000); // Adjust delay as needed
  };

  // const handleListTicket = () => {
  //   setTicketListed(true);
  // };

  const handleListTicket = () => {
    const {
      ticketDate,
      ticketCategory,
      numberOfTickets,
      seatSection,
      seatNumber,
      sellingPrice,
    } = ticketDetails;

    // Simple front-end validation
    if (
      !ticketDate ||
      !ticketCategory ||
      !numberOfTickets ||
      !seatSection ||
      !seatNumber ||
      !sellingPrice
    ) {
      alert('Please select all options');
      return;
    } else {
      setToastMessage('Ticket listed on marketplace successfully!');
    }

    // If validation is successful
    setShowModal(false); // Close the modal
    setShowToast(true); // Show success toast
    setTicketListed(true);

    // // Delay the purchase handling to allow the toast to show
    // setTimeout(() => {
    //   // Call the function passed from the parent component to update the ticket status
    //   onListingOfTicket(ticket.id);
    // }, 3000); // 500ms delay

    // Reset form fields after a slight delay to ensure state update happens after the toast is shown
    setTimeout(() => {
      setTicketDetails({
        ticketDate: '',
        ticketCategory: '',
        numberOfTickets: '',
        seatSection: '',
      });
    }, 1000); // Adjust delay as needed
  };

  const handleUseTicket = () => {
    const {
      ticketDate,
      ticketCategory,
      numberOfTickets,
      seatSection,
      seatNumber,
    } = ticketDetails;

    // Simple front-end validation
    if (
      !ticketDate ||
      !ticketCategory ||
      !numberOfTickets ||
      !seatSection ||
      !seatNumber
    ) {
      alert('Please select all options');
      return;
    } else {
      setToastMessageForUsingTicket(
        'Enjoy Your Concert! You have earned 10 LP!'
      );
    }

    // If validation is successful
    setShowModalForUsingTicket(false); // Close the modal
    setShowToastForUsingTicket(true); // Show success toast
    // setTicketListed(true);

    // Delay the purchase handling to allow the toast to show
    setTimeout(() => {
      // Call the function passed from the parent component to update the ticket status
      onUsageOfTicket(ticket.id);
    }, 3000); // 500ms delay

    // Reset form fields after a slight delay to ensure state update happens after the toast is shown
    setTimeout(() => {
      setTicketDetails({
        ticketDate: '',
        ticketCategory: '',
        numberOfTickets: '',
        seatSection: '',
      });
    }, 1000); // Adjust delay as needed
  };

  const handleVote = () => {
    const {
      ticketDate,
      ticketCategory,
      numberOfTickets,
      seatSection,
      seatNumber,
    } = ticketDetails;

    // // Simple front-end validation
    // if (
    //   !ticketDate ||
    //   !ticketCategory ||
    //   !numberOfTickets ||
    //   !seatSection ||
    //   !seatNumber
    // ) {
    //   alert('Please select all options');
    //   return;
    // } else {
    setToastMessageForEncoreSongVoting('Vote submitted! Enjoy!');
    // }

    // If validation is successful
    setShowModalForEncoreSongVoting(false); // Close the modal
    setShowToastForEncoreSongVoting(true); // Show success toast
    // setTicketListed(true);

    // Delay the purchase handling to allow the toast to show
    setTimeout(() => {
      // Call the function passed from the parent component to update the ticket status
      onVoting(ticket.id);
    }, 3000); // 500ms delay

    // Reset form fields after a slight delay to ensure state update happens after the toast is shown
    setTimeout(() => {
      setTicketDetails({
        ticketDate: '',
        ticketCategory: '',
        numberOfTickets: '',
        seatSection: '',
      });
    }, 1000); // Adjust delay as needed
  };

  const formatDateWithoutWeekday = (dateString) => {
    const parts = new Date(dateString).toDateString().split(' ');
    return `${parts[2]} ${parts[1]} ${parts[3]}`; // This will format it as "month day year"
  };

  // handle navigation to the voting page
  const handleNavigationToVotingPage = () => {
    window.location.href = '/voting';
  };

  // if ticket has been purchased
  if (
    ticket.hasBeenPurchased &&
    !ticket.myTicketsReadyToUse &&
    !ticket.myTicketsListedForSale
  ) {
    return (
      <>
        <ToastContainer
          className="p-3"
          position="middle-center"
          style={{ position: 'fixed', zIndex: 9999 }}
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
            <div style={{ marginLeft: 10 }}>
              <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                {ticket.concertName}
              </h4>
            </div>
            <Container>
              <Row>
                <Col xs={6} style={{ fontWeight: 'bold' }}>
                  {ticket.venue}
                </Col>
                <Col xs={1}></Col>
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
              <div style={{ padding: 5 }}></div>
              <Row>
                <Col>
                  <p style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                    Details: {ticket.category}, {ticket.section}, Seat{' '}
                    {ticket.seatNumber}
                  </p>
                </Col>
              </Row>
            </Container>
            <hr />
            <div style={{ display: 'flex' }}>
              <Col>
                <p style={{ fontSize: 15 }}>Tickets Reselling From:</p>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 25, height: 25 }}>
                    <img src={ethereumCurrency} alt="Ethereum" />
                  </div>
                  <h5>
                    ${ticket.price - 60} - ${ticket.price + 60}
                  </h5>
                </div>
              </Col>
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  style={{
                    backgroundColor: ticketListed ? '#8B0000' : '#6F4FF2',
                  }}
                  onClick={handleShowModal}
                >
                  {' '}
                  {ticketListed ? 'Listed for sale' : 'Sell Ticket'}{' '}
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
                            {ticket.concertName}
                          </h2>
                          <h5>Venue: {ticket.venue}</h5>{' '}
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
                                <option value={ticket.category}>
                                  {ticket.category}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Number of Tickets</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.numberOfTickets}
                                onChange={(e) =>
                                  handleChange(
                                    'numberOfTickets',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select a number</option>
                                <option value="1">1</option>
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
                                <option value="">Select a section</option>
                                <option value={ticket.section}>
                                  {ticket.section}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Seat Number</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatNumber}
                                onChange={(e) =>
                                  handleChange('seatNumber', e.target.value)
                                }
                              >
                                <option value="">Select a seat</option>
                                <option value={ticket.seatNumber}>
                                  {ticket.seatNumber}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Selling Price</Form.Label>
                              <Form.Control
                                type="text"
                                value={ticketDetails.sellingPrice}
                                onChange={(e) =>
                                  handleChange('sellingPrice', e.target.value)
                                }
                              ></Form.Control>
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
                    <Button variant="primary" onClick={handleListTicket}>
                      Sell Ticket
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // if ticket ready to be used
  if (ticket.myTicketsReadyToUse && !ticket.ticketUsed) {
    return (
      <>
        <ToastContainer
          className="p-3"
          position="middle-center"
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          <Toast
            onClose={() => setShowToastForUsingTicket(false)}
            show={showToastForUsingTicket}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessageForUsingTicket}</Toast.Body>
          </Toast>
        </ToastContainer>
        <ToastContainer
          className="p-3"
          position="middle-center"
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          <Toast
            onClose={() => setShowToastForEncoreSongVoting(false)}
            show={showToastForEncoreSongVoting}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessageForEncoreSongVoting}</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="ticket-card-home">
          <img src={ticket.imageUrl} alt={ticket.name} className="cards" />
          <div className="ticket-info-home">
            <div style={{ marginLeft: 10 }}>
              <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                {ticket.concertName}
              </h4>
            </div>
            <Container>
              <Row>
                <Col xs={6} style={{ fontWeight: 'bold' }}>
                  {ticket.venue}
                </Col>
                <Col xs={1}></Col>
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
              <div style={{ padding: 5 }}></div>
              <Row>
                <Col>
                  <p style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                    Details: {ticket.category}, {ticket.section}, Seat{' '}
                    {ticket.seatNumber}
                  </p>
                </Col>
              </Row>
            </Container>
            <hr />
            <div style={{ display: 'flex' }}>
              <Col>
                <p style={{ fontSize: 15 }}>Tickets Reselling From:</p>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 25, height: 25 }}>
                    <img src={ethereumCurrency} alt="Ethereum" />
                  </div>
                  <h5>
                    ${ticket.price - 60} - ${ticket.price + 60}
                  </h5>
                </div>
              </Col>
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  style={{
                    backgroundColor: ticket.voted ? ' #FFA500' : '#7f9bff',
                    marginRight: 10,
                  }}
                  onClick={handleShowModalForEncoreSongVoting}
                >
                  {ticket.voted ? 'Update Vote' : 'Vote Encore Song'}
                </Button>
                <Button
                  style={{
                    backgroundColor: '#5dd55d',
                  }}
                  onClick={handleShowModalForUsingTicket}
                >
                  Use Ticket
                </Button>
                <Modal
                  show={showModalForUsingTicket}
                  onHide={handleCloseModalForUsingTicket}
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
                            {ticket.concertName}
                          </h2>
                          <h5>Venue: {ticket.venue}</h5>{' '}
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
                                <option value={ticket.category}>
                                  {ticket.category}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Number of Tickets</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.numberOfTickets}
                                onChange={(e) =>
                                  handleChange(
                                    'numberOfTickets',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select a number</option>
                                <option value="1">1</option>
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
                                <option value="">Select a section</option>
                                <option value={ticket.section}>
                                  {ticket.section}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Seat Number</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatNumber}
                                onChange={(e) =>
                                  handleChange('seatNumber', e.target.value)
                                }
                              >
                                <option value="">Select a seat</option>
                                <option value={ticket.seatNumber}>
                                  {ticket.seatNumber}
                                </option>
                              </Form.Control>
                            </Form.Group>
                          </Form>
                        </Col>
                      </Row>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleCloseModalForUsingTicket}
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleUseTicket}>
                      Use Ticket
                    </Button>
                  </Modal.Footer>
                </Modal>
                <Modal
                  show={showModalForEncoreSongVoting}
                  onHide={handleCloseModalForEncoreSongVoting}
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
                            Vote for Encore Song!
                          </h2>
                          <Form>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Cruel Summer</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.ticketDate}
                                onChange={(e) =>
                                  handleChange('ticketDate', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Blank Space</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.ticketCategory}
                                onChange={(e) =>
                                  handleChange('ticketCategory', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Love Story</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.numberOfTickets}
                                onChange={(e) =>
                                  handleChange(
                                    'numberOfTickets',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Lover</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatSection}
                                onChange={(e) =>
                                  handleChange('seatSection', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Shake It Off</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatNumber}
                                onChange={(e) =>
                                  handleChange('seatNumber', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                          </Form>
                        </Col>
                      </Row>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleCloseModalForEncoreSongVoting}
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleVote}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // if ticket has been used, proceed with redirecting to the voting page
  if (ticket.ticketUsed) {
    return (
      <>
        <ToastContainer
          className="p-3"
          position="middle-center"
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          <Toast
            onClose={() => setShowToastForUsingTicket(false)}
            show={showToastForUsingTicket}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessageForUsingTicket}</Toast.Body>
          </Toast>
        </ToastContainer>
        <ToastContainer
          className="p-3"
          position="middle-center"
          style={{ position: 'fixed', zIndex: 9999 }}
        >
          <Toast
            onClose={() => setShowToastForEncoreSongVoting(false)}
            show={showToastForEncoreSongVoting}
            delay={5000}
            autohide
          >
            <Toast.Header>
              <strong className="me-auto">Success</strong>
            </Toast.Header>
            <Toast.Body>{toastMessageForEncoreSongVoting}</Toast.Body>
          </Toast>
        </ToastContainer>
        <div className="ticket-card-home">
          <img src={ticket.imageUrl} alt={ticket.name} className="cards" />
          <div className="ticket-info-home">
            <div style={{ marginLeft: 10 }}>
              <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                {ticket.concertName}
              </h4>
            </div>
            <Container>
              <Row>
                <Col xs={6} style={{ fontWeight: 'bold' }}>
                  {ticket.venue}
                </Col>
                <Col xs={1}></Col>
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
              <div style={{ padding: 5 }}></div>
              <Row>
                <Col>
                  <p style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                    Details: {ticket.category}, {ticket.section}, Seat{' '}
                    {ticket.seatNumber}
                  </p>
                </Col>
              </Row>
            </Container>
            <hr />
            <div style={{ display: 'flex' }}>
              <Col>
                <p style={{ fontSize: 15 }}>Tickets Reselling From:</p>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 25, height: 25 }}>
                    <img src={ethereumCurrency} alt="Ethereum" />
                  </div>
                  <h5>
                    ${ticket.price - 60} - ${ticket.price + 60}
                  </h5>
                </div>
              </Col>
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  style={{
                    backgroundColor: ticket.voted ? ' #FFA500' : '#7f9bff',
                    marginRight: 10,
                  }}
                  onClick={handleShowModalForEncoreSongVoting}
                >
                  {ticket.voted ? 'Update Vote' : 'Vote Encore Song'}
                </Button>
                <Button
                  style={{
                    backgroundColor: ticket.ticketUsed ? '#7f9bff' : '#5dd55d',
                  }}
                  onClick={handleNavigationToVotingPage}
                >
                  Vote Future Concerts
                </Button>
                <Modal
                  show={showModalForEncoreSongVoting}
                  onHide={handleCloseModalForEncoreSongVoting}
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
                            Vote for Encore Song!
                          </h2>
                          <Form>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Cruel Summer</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.ticketDate}
                                onChange={(e) =>
                                  handleChange('ticketDate', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Blank Space</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.ticketCategory}
                                onChange={(e) =>
                                  handleChange('ticketCategory', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Love Story</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.numberOfTickets}
                                onChange={(e) =>
                                  handleChange(
                                    'numberOfTickets',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Lover</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatSection}
                                onChange={(e) =>
                                  handleChange('seatSection', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Shake It Off</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatNumber}
                                onChange={(e) =>
                                  handleChange('seatNumber', e.target.value)
                                }
                              >
                                <option value="0">0</option>
                                <option value="1">1</option>
                              </Form.Control>
                            </Form.Group>
                          </Form>
                        </Col>
                      </Row>
                    </Container>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={handleCloseModalForEncoreSongVoting}
                    >
                      Close
                    </Button>
                    <Button variant="primary" onClick={handleVote}>
                      Submit
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // if ticket listed for sale under my tickets
  if (ticket.myTicketsListedForSale) {
    return (
      <>
        <ToastContainer
          className="p-3"
          position="middle-center"
          style={{ position: 'fixed', zIndex: 9999 }}
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
            <div style={{ marginLeft: 10 }}>
              <h4 style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                {ticket.concertName}
              </h4>
            </div>
            <Container>
              <Row>
                <Col xs={6} style={{ fontWeight: 'bold' }}>
                  {ticket.venue}
                </Col>
                <Col xs={1}></Col>
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
              <div style={{ padding: 5 }}></div>
              <Row>
                <Col>
                  <p style={{ fontWeight: 'bold', color: '#6F4FF2' }}>
                    Details: {ticket.category}, {ticket.section}, Seat{' '}
                    {ticket.seatNumber}
                  </p>
                </Col>
              </Row>
            </Container>
            <hr />
            <div style={{ display: 'flex' }}>
              <Col>
                <p style={{ fontSize: 15 }}>Tickets Reselling For:</p>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: 25, height: 25 }}>
                    <img src={ethereumCurrency} alt="Ethereum" />
                  </div>
                  <h5>{ticket.price}</h5>
                </div>
              </Col>
              <div style={{ marginLeft: 'auto' }}>
                <Button
                  style={{
                    backgroundColor: '#ff7f8a',
                  }}
                  onClick={handleShowModal}
                >
                  Listed For Sale
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
                            {ticket.concertName}
                          </h2>
                          <h5>Venue: {ticket.venue}</h5>{' '}
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
                                <option value={ticket.category}>
                                  {ticket.category}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Number of Tickets</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.numberOfTickets}
                                onChange={(e) =>
                                  handleChange(
                                    'numberOfTickets',
                                    e.target.value
                                  )
                                }
                              >
                                <option value="">Select a number</option>
                                <option value="1">1</option>
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
                                <option value="">Select a section</option>
                                <option value={ticket.section}>
                                  {ticket.section}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Seat Number</Form.Label>
                              <Form.Control
                                as="select"
                                value={ticketDetails.seatNumber}
                                onChange={(e) =>
                                  handleChange('seatNumber', e.target.value)
                                }
                              >
                                <option value="">Select a seat</option>
                                <option value={ticket.seatNumber}>
                                  {ticket.seatNumber}
                                </option>
                              </Form.Control>
                            </Form.Group>
                            <Form.Group style={{ marginRight: 20 }}>
                              <Form.Label>Selling Price</Form.Label>
                              <Form.Control
                                type="text"
                                value={ticketDetails.sellingPrice}
                                onChange={(e) =>
                                  handleChange('sellingPrice', e.target.value)
                                }
                              ></Form.Control>
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
                    <Button variant="primary" onClick={handleListTicket}>
                      Sell Ticket
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // if ticket has not been purchased

  return (
    <>
      <ToastContainer
        className="p-3"
        position="middle-center"
        style={{ position: 'fixed', zIndex: 9999 }}
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
                          {ticket.title}
                        </h2>
                        <h5>Venue: {ticket.venue}</h5>{' '}
                        <h6 style={{ fontWeight: 'bold' }}>
                          Seller: @{ticket.username} {'  '} {ticket.starRating}
                        </h6>{' '}
                        {/* Include seller name and rating */}
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
                                // handleChange('numberOfTickets', e.target.value);
                                // setNumberOfTicketsPurchased(e.target.value)
                                handleChangeForNumberOfTickets(
                                  'numberOfTickets',
                                  e.target.value
                                )
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
