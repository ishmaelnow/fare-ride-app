const express = require('express');
const Ride = require('../models/Ride');
const Driver = require('../models/Driver'); // Import Driver model
const sendEmail = require('../utils/sendEmail'); // Import email utility
const router = express.Router();

// Get all rides
router.get('/', async (req, res) => {
  try {
    const rides = await Ride.find();
    res.json(rides);
  } catch (err) {
    console.error('Error fetching rides:', err);
    res.status(500).json({ error: 'Failed to fetch rides' });
  }
});

// Book a ride and send email confirmation
router.post('/', async (req, res) => {
  try {
    const { customerName, phone, email, pickupLocation, dropoffLocation, pickupTime } = req.body;

    // Create a new ride
    const newRide = new Ride({
      customerName,
      phone,
      email,
      pickupLocation,
      dropoffLocation,
      pickupTime,
    });
    await newRide.save();

    // Email content
    const emailText = `
      Hi ${customerName},

      Thank you for booking a ride with Fare Ride! Here are your ride details:
      - Pickup Location: ${pickupLocation}
      - Dropoff Location: ${dropoffLocation}
      - Pickup Time: ${new Date(pickupTime).toLocaleString()}

      We look forward to serving you!

      Best regards,
      Fare Ride Team
    `;

    // Attempt to send email confirmation
    try {
      await sendEmail({
        to: email, // Target recipient email
        subject: 'Ride Confirmation - Fare Ride', // Email subject
        text: emailText, // Email body with ride details
      });
      console.log(`Email sent to ${email}`);
    } catch (emailErr) {
      console.error('Error sending email:', emailErr.message);
    }

    res.status(201).json(newRide); // Return the newly created ride
  } catch (err) {
    console.error('Error booking ride:', err);
    res.status(500).json({ error: 'Failed to book ride' });
  }
});

// Assign a driver to a ride, creating the driver if needed
router.put('/:id/assign-driver', async (req, res) => {
  try {
    const { driverName, driverPhone, driverEmail } = req.body;

    // Check if the driver already exists
    let driver = await Driver.findOne({ name: driverName });
    if (!driver) {
      // Create a new driver
      driver = new Driver({
        name: driverName,
        phone: driverPhone,
        email: driverEmail,
        isAvailable: true, // Mark driver as available by default
      });
      await driver.save();
    }

    // Assign the driver to the ride
    const ride = await Ride.findByIdAndUpdate(
      req.params.id,
      { driverName: driver.name }, // Update the ride with the driver's name
      { new: true } // Return the updated ride document
    );

    if (!ride) {
      return res.status(404).json({ error: 'Ride not found' });
    }

    res.json({ ride, driver }); // Return both the updated ride and driver info
  } catch (err) {
    console.error('Error assigning driver:', err);
    res.status(500).json({ error: 'Failed to assign driver' });
  }
});

module.exports = router;
