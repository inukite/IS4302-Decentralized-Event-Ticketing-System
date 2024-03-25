import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

const Home = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return <></>;
};

export default Home;
