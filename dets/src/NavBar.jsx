import { Navbar, Nav, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

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
        <Container>
          <Navbar.Brand href="#home">
            <div href="#home" style={{ marginLeft: 10 }}>
              <img
                alt=""
                src={require('./DET Token image.png')}
                width="50"
                height="50"
                className="d-inline-block align-top"
              />
            </div>
          </Navbar.Brand>
          <Navbar.Brand>DET Tickets</Navbar.Brand>
          <div style={{ marginLeft: '20%' }}></div>
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
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="upcomingconcerts">Upcoming Concerts</Nav.Link>
              <Nav.Link href="marketplace">Marketplace</Nav.Link>
              <Nav.Link href="mytickets">My Tickets</Nav.Link>
            </Nav>
          </Navbar.Collapse>
          <>
            <div style={{ marginLeft: 10, padding: 5 }}>
              <button
                onClick={connectWallet}
                style={{
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: 'light-gray',
                  textAlign: 'center',
                }}
              >
                {isConnected ? 'Disconnect' : 'Connect'}
                {isConnected && <p>{userAddress.substring(0, 10)}...</p>}
              </button>
            </div>
          </>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
