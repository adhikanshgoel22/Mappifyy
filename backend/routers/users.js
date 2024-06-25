import User from '../models/User.js';
import express from 'express';
import bcrypt from 'bcryptjs';

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Generate new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save user and respond
    res.status(200).json(newUser.id);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    // Find user
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) return res.status(400).json("Wrong username or password");

    // Validate password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json("Wrong username or password");

    // Send response
    res.status(200).json({ id: user.id, username: user.username });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
