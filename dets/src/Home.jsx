import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';

const Home = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <div
        style={{
          padding: 20,
          alignContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <img src={require('./Cover Image.png')} alt="Concert" />
      </div>
    </>
  );
};

export default Home;
