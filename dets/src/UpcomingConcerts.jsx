import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';
import ConcertsGrid from './ConcertsGrid';

const UpcomingConcerts = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <ConcertsGrid />
    </>
  );
};

export default UpcomingConcerts;
