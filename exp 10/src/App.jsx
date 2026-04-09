import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed Router import
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Search from './pages/Search';
import Booking from './pages/Booking';
import Payment from './pages/Payment';
import History from './pages/History';
import Login from './pages/Login';
import Register from './pages/Register';


function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
