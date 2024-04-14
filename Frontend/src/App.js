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
import Voting from './Voting';
import Organizer from './Organizer';

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
          <Route path="/voting" element={<Voting />} />
          <Route path="/organizer" element={<Organizer />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserAddressProvider>
  );
};

export default App;
