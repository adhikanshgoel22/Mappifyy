import express from "express";
import Pin from '../models/Pin.js';

const router = express.Router();

// Create a new pin
router.post("/", async (req, res) => {
  const newPin = new Pin(req.body);
  try {
    const savedPin = await newPin.save();
    res.status(200).json(savedPin);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all pins
router.get("/", async (req, res) => {
  try {
    const pins = await Pin.findAll();
    res.status(200).json(pins);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
