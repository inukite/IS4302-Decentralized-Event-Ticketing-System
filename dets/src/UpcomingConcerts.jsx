import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

const UpcomingConcerts = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <div>Upcoming Concerts</div>
    </>
  );
};

export default UpcomingConcerts;
