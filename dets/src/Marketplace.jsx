import React, { useState } from 'react';
import { useUserAddress } from './UserAddressContext';
import FavouriteArtists from './FavouriteArtists';

const Marketplace = () => {
  const { userAddress, setUserAddress } = useUserAddress();

  return (
    <>
      <FavouriteArtists />
    </>
  );
};

export default Marketplace;
