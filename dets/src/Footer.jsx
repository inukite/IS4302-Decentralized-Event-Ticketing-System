import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">DET Tickets</div>
          <p className="footer-description">
            Ethereum blockchain ticketing marketplace for fans around the world.
            Rest assured that ticket purchases here are genuine.
          </p>
        </div>
        <div className="footer-section">
          <h5>Explore</h5>
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/upcomingconcerts">Upcoming Concerts</a>
            </li>
            <li>
              <a href="/marketplace">Marketplace</a>
            </li>
            <li>
              <a href="/mytickets">My Tickets</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h5>Links</h5>
          <ul>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/faq">FAQ</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            <li>
              <a href="/about">About</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} DET Tickets. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
