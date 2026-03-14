import express from 'express';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const router = express.Router();

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const {
    nickname,
    email,
    password,
    occupation,
    walletAddress,
    customInstructions,
    behavioralPreference,
    styleTone,
    interestsValues,
  } = req.body;

  const userExists = await User.findOne({ email });
  const walletExists = await User.findOne({ walletAddress });

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  if (walletExists) {
    return res.status(400).json({ message: 'Wallet address already linked to another account' });
  }

  const user = await User.create({
    nickname,
    email,
    password,
    occupation,
    walletAddress,
    customInstructions,
    behavioralPreference,
    styleTone,
    interestsValues,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      walletAddress: user.walletAddress,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      nickname: user.nickname,
      email: user.email,
      walletAddress: user.walletAddress,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});

export default router;
