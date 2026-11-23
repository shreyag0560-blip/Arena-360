import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import Facilities from './pages/Facilities.jsx';
import Book from './pages/Book.jsx';
import Trainers from './pages/Trainers.jsx';
import TrainerBook from './pages/TrainerBook.jsx';
import Payment from './pages/Payment.jsx';
import Confirmation from './pages/Confirmation.jsx';
import MyBookings from './pages/MyBookings.jsx';
import History from './pages/History.jsx';
import Profile from './pages/Profile.jsx';
import NotFound from './pages/NotFound.jsx';

// Only logged-in users may open these pages
function Protected({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  return children;
}

// Logged-in users don't need to see login/register again
function GuestOnly({ children }) {
  const { user } = useAuth();
  return user ? <Navigate to="/sports" replace /> : children;
}

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/sports" element={<Protected><Facilities /></Protected>} />
          <Route path="/book/:venueId" element={<Protected><Book /></Protected>} />
          <Route path="/trainers" element={<Protected><Trainers /></Protected>} />
          <Route path="/trainers/:trainerId" element={<Protected><TrainerBook /></Protected>} />
          <Route path="/payment" element={<Protected><Payment /></Protected>} />
          <Route path="/confirmation/:bookingId" element={<Protected><Confirmation /></Protected>} />
          <Route path="/bookings" element={<Protected><MyBookings /></Protected>} />
          <Route path="/history" element={<Protected><History /></Protected>} />
          <Route path="/profile" element={<Protected><Profile /></Protected>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
