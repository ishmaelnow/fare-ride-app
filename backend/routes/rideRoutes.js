const express = require('express');
const router = express.Router();
const Ride = require('../models/Ride');
const Driver = require('../models/Driver');
const sendEmail = require('../utils/sendEmail');

// Fetch all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.status(200).json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err.message);
    res.status(500).json({ error: 'Could not fetch rides. Please try again later.' });
  }
});

// Book a ride and send confirmation email
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, pickupLocation, dropoffLocation, pickupTime } = req.body;
    if (!customerName || !phone || !email || !pickupLocation || !dropoffLocation || !pickupTime) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newRide = new Ride({ customerName, phone, email, pickupLocation, dropoffLocation, pickupTime });
    await newRide.save();

    const emailText = `
      Hi ${customerName},
      Thank you for booking with Fare Ride!
      Pickup: ${pickupLocation}
      Dropoff: ${dropoffLocation}
      Time: ${new Date(pickupTime).toLocaleString()}
    `;

    await sendEmail({ to: email, subject: 'Ride Confirmation', text: emailText });

    res.status(201).json(newRide);
  } catch (err) {
    console.error('Error booking ride:', err.message);
    res.status(500).json({ error: 'Failed to book ride.' });
  }
});

// Assign a driver to a ride
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const { driverName, driverPhone, driverEmail } = req.body;

    if (!driverName || !driverPhone || !driverEmail) {
      return res.status(400).json({ error: 'Driver details are required.' });
    }

    let driver = await Driver.findOne({ name: driverName });
    if (!driver) {
      driver = new Driver({ name: driverName, phone: driverPhone, email: driverEmail, isAvailable: true });
      await driver.save();
    }

    const ride = await Ride.findByIdAndUpdate(req.params.id, { driverName: driver.name }, { new: true });
    if (!ride) {
      return res.status(404).json({ error: 'Ride not found.' });
    }

    res.status(200).json({ ride, driver });
  } catch (err) {
    console.error('Error assigning driver:', err.message);
    res.status(500).json({ error: 'Failed to assign driver.' });
  }
});

module.exports = router;
