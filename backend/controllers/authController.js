import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
export const logoutUser = (req, res) => {
  // If you decide to use cookies later, this clears them
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { 
      nickname, email, password, occupation, walletAddress,
      customInstructions, behaviorPreferences, stylePreferences, 
      tonePreferences, interestsAndValues 
    } = req.body;

    // 1. Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // 2. Create User (Password hashing happens automatically in our Model!)
    const user = await User.create({
      nickname, email, password, occupation, walletAddress,
      customInstructions, behaviorPreferences, stylePreferences, 
      tonePreferences, interestsAndValues
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        nickname: user.nickname,
        email: user.email,
        token: generateToken(user._id), // We will build this next
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      nickname: user.nickname,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Utility function to sign JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};