import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

const MyTickets = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <div>My Tickets</div>
    </>
  );
};

export default MyTickets;
