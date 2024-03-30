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
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Alert from 'react-bootstrap/Alert';

const concerts = [
  {
    id: 1,
    name: 'Ed Sheeran Asia Tour',
    handle: '@CosmicArtisan, @Sculptor',
    date: new Date('14 Apr 2024'),
    imageUrl: EdSheeranAsiaTour,
    price: 129,
    onSale: true,
    venue: 'Singapore Indoor Stadium',
  },
  {
    id: 2,
    name: 'Taylor Swift Eras Tour',
    handle: '@SwiftieForever',
    date: new Date('25 April 2024'),
    imageUrl: TaylorSwiftErasTour,
    price: 159,
    onSale: true,
    venue: 'National Stadium',
  },
  {
    id: 3,
    name: 'IU World Tour',
    handle: '@IUOfficial, @IUWorldTour',
    date: new Date('7 May 2024'),
    imageUrl: IUConcert,
    price: 149,
    onSale: true,
    venue: 'Star Vista',
  },
  {
    id: 4,
    name: 'Coldplay: World Tour',
    handle: '@Robotica, @MysticInk',
    date: new Date('20 May 2024'),
    imageUrl: ColdplayWorldTour,
    price: 89,
    onSale: true,
    venue: 'National Stadium',
  },
  {
    id: 5,
    name: 'LANY Concert',
    handle: '@EtherFlow, @NanoNebula',
    date: new Date('4 Aug 2024'),
    imageUrl: LANYConcert,
    price: 129,
    onSale: false,
    venue: 'Star Vista',
  },
  {
    id: 6,
    name: 'Lauv: Asia Tour',
    handle: '@BinaryBard',
    date: new Date('11 Nov 2024'),
    imageUrl: LauvAsiaTour,
    price: 59,
    onSale: false,
    venue: 'Singapore Indoor Stadium',
  },
  {
    id: 7,
    name: 'Bruno Mars',
    handle: '@LunarArt, @Robotica',
    date: new Date('14 Feb 2025'),
    imageUrl: BrunoMars,
    price: 159,
    onSale: false,
    venue: 'National Stadium',
  },
];

const ConcertCard = ({ concert }) => {
  const [showModal, setShowModal] = useState(false);
  const [onWaitlist, setOnWaitlist] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle showing and hiding of the modal
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Function to handle both buying tickets and joining/leaving the waitlist
  const handleAction = () => {
    if (concert.onSale) {
      // Assuming ticket purchase is instant for demonstration
      setShowModal(true);
    } else {
      // Toggle waitlist status and show corresponding message
      setOnWaitlist(!onWaitlist);
      setToastMessage(
        onWaitlist
          ? 'You have left the waitlist successfully.'
          : 'You have joined the waitlist successfully.'
      );
      setShowToast(true);
    }
  };

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
      setToastMessage('Tickets purchased successfully!');
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
                <Button
                  style={{
                    backgroundColor: onWaitlist ? '#dc3545' : '#6F4FF2',
                  }}
                  onClick={handleAction}
                >
                  {concert.onSale
                    ? 'Buy Now'
                    : onWaitlist
                    ? 'Leave Waitlist'
                    : 'Join Waitlist'}
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
                          src={concert.imageUrl}
                          alt={concert.name}
                          style={{ width: '100%', padding: 20 }}
                        />
                      </Row>
                      <Row>
                        <Col>
                          <h2 style={{ color: '#6F4FF2', fontWeight: 'bold' }}>
                            {concert.name}
                          </h2>
                          <h5>{concert.venue}</h5>{' '}
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
                                <option value={concert.date.toDateString()}>
                                  {concert.date.toDateString()}
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
                                <option value="cat1">Cat 1</option>
                                <option value="cat2">Cat 2</option>
                                <option value="cat3">Cat 3</option>
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
                                <option value="">Choose a number</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                                <option value="8">8</option>
                                <option value="9">9</option>
                                <option value="10">10</option>
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
                                <option value="Section A">Section A</option>
                                <option value="Section B">Section B</option>
                                <option value="Section C">Section C</option>
                                <option value="Section D">Section D</option>
                                <option value="Section E">Section E</option>
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
                      {concert.onSale ? 'Buy Ticket' : 'Join Waitlist'}
                    </Button>
                  </Modal.Footer>
                </Modal>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </>
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
