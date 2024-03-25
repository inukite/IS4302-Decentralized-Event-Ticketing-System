import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

const Home = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <div>Home</div>
      <div>User Address: {userAddress}</div>
    </>
  );
};

export default Home;
