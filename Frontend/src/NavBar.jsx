import { Navbar, Nav, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import React, { useEffect } from 'react';
import { useUserAddress } from './UserAddressContext';
import { useLocation } from 'react-router-dom'; // Import useLocation

// Example NavBar component
const NavBar = () => {
  const { userAddress, setUserAddress } = useUserAddress();
  const location = useLocation(); // Get current location
  // const [userAddress, setUserAddress] = useState('');
  // const isConnected = Boolean(userAddress); // Determines if a user is connected

  /**************************************************************************** */
  /**************************************************************************** */
  /**************************************************************************** */
  /**************************************************************************** */
  /**************************************************************************** */
  // FOR RYAN:
  const wantToBeOrganizer = false;
  /**************************************************************************** */
  /**************************************************************************** */
  /**************************************************************************** */
  /**************************************************************************** */
  /**************************************************************************** */

  // On component mount, check if the user is connected
  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedAddress');
    if (connectedAddress) {
      setUserAddress(connectedAddress);
    }
  }, [setUserAddress]);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        setUserAddress(accounts[0]);
        // Set connected address in local storage
        localStorage.setItem('connectedAddress', accounts[0]);
      } catch (error) {
        console.error('Error connecting to MetaMask', error);
      }
    } else {
      alert('Please install MetaMask to use this feature!');
    }
  };

  const disconnectWallet = () => {
    setUserAddress('');
    // Clear the connected address in local storage
    localStorage.removeItem('connectedAddress');
  };

  // Function to determine if the nav link is active
  const isActive = (path) => location.pathname === path;

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
              <Nav.Link
                href="/"
                style={{ color: isActive('/') ? '#7f9bff' : '#000000' }}
              >
                Home
              </Nav.Link>
              {!wantToBeOrganizer && (
                <Nav.Link
                  href="upcomingconcerts"
                  style={{
                    color: isActive('/upcomingconcerts')
                      ? '#7f9bff'
                      : '#000000',
                  }}
                >
                  Upcoming Concerts
                </Nav.Link>
              )}
              {!wantToBeOrganizer && (
                <Nav.Link
                  href="marketplace"
                  style={{
                    color: isActive('/marketplace') ? '#7f9bff' : '#000000',
                  }}
                >
                  Marketplace
                </Nav.Link>
              )}
              {!wantToBeOrganizer && (
                <Nav.Link
                  href="mytickets"
                  style={{
                    color: isActive('/mytickets') ? '#7f9bff' : '#000000',
                  }}
                >
                  My Tickets
                </Nav.Link>
              )}
              {!wantToBeOrganizer && (
                <Nav.Link
                  href="voting"
                  style={{
                    color: isActive('/voting') ? '#7f9bff' : '#000000',
                  }}
                >
                  Voting
                </Nav.Link>
              )}

              {/* only show organizer link if user is connected */}
              {userAddress && wantToBeOrganizer && (
                <Nav.Link
                  href="organizer"
                  style={{
                    color: isActive('/organizer') ? '#7f9bff' : '#000000',
                  }}
                >
                  Organizer
                </Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
          <>
            <div style={{ padding: 5 }}>
              <button
                onClick={userAddress ? disconnectWallet : connectWallet}
                style={{
                  borderRadius: 5,
                  padding: 5,
                  backgroundColor: userAddress ? '#6F4FF2' : 'lightgray',
                  color: userAddress ? 'white' : 'black',
                }}
              >
                {userAddress
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
