import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap
import './BookingPage.css'; // Import custom styles

const BookingPage = () => {
  const [rides, setRides] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: '',
  });

  // Fetch rides from backend
  const fetchRides = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/rides`);
      setRides(response.data);
    } catch (error) {
      console.error('Error fetching rides:', error.message);
    }
  };

  // Fetch drivers from backend
  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/drivers`);
      setDrivers(response.data);
    } catch (error) {
      console.error('Error fetching drivers:', error.message);
    }
  };

  // Book a ride
  const bookRide = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/rides`, form, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Ride booked:', response.data);
      setForm({
        customerName: '',
        phone: '',
        email: '',
        pickupLocation: '',
        dropoffLocation: '',
        pickupTime: '',
      });
      fetchRides(); // Refresh rides list
    } catch (error) {
      console.error('Error booking ride:', error.message);
    }
  };

  // Assign an existing driver to a specific ride
  const assignDriver = async (rideId, driverName) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/rides/${rideId}/assign-driver`,
        { driverName },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Driver assigned:', response.data);

      fetchRides(); // Refresh rides list
    } catch (error) {
      console.error('Error assigning driver:', error.message);
    }
  };

  useEffect(() => {
    fetchRides();
    fetchDrivers(); // Fetch drivers when the component loads
  }, []);

  return (
    <div className="container mt-4">
      <div className="card shadow mb-4">
        <div className="card-body">
          <h2 className="text-center mb-4">Book a Ride</h2>
          <form onSubmit={bookRide}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Customer Name"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Pickup Location"
                value={form.pickupLocation}
                onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Dropoff Location"
                value={form.dropoffLocation}
                onChange={(e) => setForm({ ...form, dropoffLocation: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="datetime-local"
                className="form-control"
                value={form.pickupTime}
                onChange={(e) => setForm({ ...form, pickupTime: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Book Ride</button>
          </form>
        </div>
      </div>

      <h2 className="text-center mb-4">Rides</h2>
      <ul className="list-group">
        {rides.length > 0 ? (
          rides.map((ride) => (
            <li key={ride._id} className="list-group-item mb-3">
              <strong>{ride.customerName}</strong> - {ride.pickupLocation} to {ride.dropoffLocation} <br />
              <em>Pickup Time:</em> {new Date(ride.pickupTime).toLocaleString()} <br />
              <em>Assigned Driver:</em> {ride.driverName || 'None'} <br />
              <div className="mt-2">
                <select
                  className="form-select"
                  onChange={(e) => assignDriver(ride._id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Select Driver
                  </option>
                  {drivers.map((driver) => (
                    <option key={driver._id} value={driver.name}>
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item">No rides available</li>
        )}
      </ul>
    </div>
  );
};

export default BookingPage;
