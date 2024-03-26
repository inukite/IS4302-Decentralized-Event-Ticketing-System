import { Navbar, Nav, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';
import Col from 'react-bootstrap/Col';

// Example NavBar component
const NavBar = () => {
  const { userAddress, setUserAddress } = useUserAddress();
  // const [userAddress, setUserAddress] = useState('');
  const isConnected = Boolean(userAddress); // Determines if a user is connected

  const connectWallet = async () => {
    // Check if MetaMask is installed
    if (window.ethereum && !isConnected) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        // Set userAddress to the first account
        setUserAddress(accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else if (isConnected) {
      // Simulate "logout" by clearing the user address
      setUserAddress('');
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  return (
    <div>
      <Navbar
        bg="light"
        expand="lg"
        style={{ display: 'flex', contentAlign: 'center' }}
      >
        <Container fluid>
          <Navbar.Brand href="/">
            <div href="/" style={{ marginLeft: 10 }}>
              <img
                alt=""
                src={require('./DET Token image.png')}
                width="50"
                height="50"
                className="d-inline-block align-top"
              />
            </div>
          </Navbar.Brand>
          <Navbar.Brand href="/">DET Tickets</Navbar.Brand>
          <div style={{ marginLeft: '10%' }}></div>
          <div>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
          </div>
          <div style={{ marginLeft: '5%' }}></div>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav text-center">
            <Nav className="me-auto text-center">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="upcomingconcerts">Upcoming Concerts</Nav.Link>
              <Nav.Link href="marketplace">Marketplace</Nav.Link>
              <Nav.Link href="mytickets">My Tickets</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <>
            <div style={{ padding: 5 }}>
              <button
                onClick={connectWallet}
                style={{
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: 'light-gray',
                }}
              >
                {isConnected
                  ? `Disconnect ${userAddress.substring(0, 10)}...`
                  : 'Connect'}
              </button>
            </div>
          </>
          <div style={{ marginLeft: '5%' }}></div>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
