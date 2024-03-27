import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

const Marketplace = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <div>Marketplace</div>
    </>
  );
};

export default Marketplace;
