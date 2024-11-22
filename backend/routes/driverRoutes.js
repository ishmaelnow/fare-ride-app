const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find({ isAvailable: true }); // Fetch only available drivers
    res.json(drivers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch drivers' });
  }
});

// Add a new driver
router.post('/', async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const newDriver = new Driver({ name, phone, email });
    const savedDriver = await newDriver.save();
    res.status(201).json(savedDriver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add driver' });
  }
});

// Mark a driver as unavailable (optional)
router.put('/:id/unavailable', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );
    if (!driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }
    res.json(driver);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update driver availability' });
  }
});

module.exports = router;
