import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import BookingPage from './components/BookingPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
  return (
    <Router>
      {/* Navbar */}
      <header className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <Link to="/" className="navbar-brand">Fair Fare Ride</Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/booking" className="nav-link">Book a Ride</Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link">About</Link>
              </li>
              <li className="nav-item">
                <Link to="/contact" className="nav-link">Contact</Link>
              </li>
            </ul>
          </div>
        </div>
      </header>

      {/* Routes */}
      <main className="container mt-4">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white text-center py-3 mt-4">
        <div className="container">
          <p className="mb-0">&copy; 2024 Fair Fare Transportation. All rights reserved.</p>
        </div>
      </footer>
    </Router>
  );
};

// Home Page Component
const HomePage = () => (
  <div className="text-center">
    <h2 className="my-4">Welcome to FairFare Transportation Services</h2>
    <p className="lead">Book a ride quickly and easily with our simple booking app!</p>
    <Link to="/booking" className="btn btn-primary btn-lg">Book a Ride Now</Link>
  </div>
);

export default App;
