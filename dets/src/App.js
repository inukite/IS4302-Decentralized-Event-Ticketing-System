import Home from './Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Marketplace from './Marketplace';
import MyTickets from './MyTickets';
import UpcomingConcerts from './UpcomingConcerts';
import { UserAddressProvider } from './UserAddressContext';

const App = () => {
  return (
    <UserAddressProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/mytickets" element={<MyTickets />} />
          <Route path="/upcomingconcerts" element={<UpcomingConcerts />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserAddressProvider>
  );
};

export default App;
