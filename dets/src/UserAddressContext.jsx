import React, { createContext, useContext, useState } from 'react';

// Create a context for the user address
const UserAddressContext = createContext();

// Create a hook to use the user address context
export const useUserAddress = () => {
  return useContext(UserAddressContext);
};

// Create a provider component
export const UserAddressProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState('');

  return (
    <UserAddressContext.Provider value={{ userAddress, setUserAddress }}>
      {children}
    </UserAddressContext.Provider>
  );
};
