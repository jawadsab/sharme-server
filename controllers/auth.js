import { validationResult } from 'express-validator';
import User from '../models/User.js';

export const register = async (req, res) => {
  try {
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors[0].msg });
    }
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    await user.save();
    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: 'Please enter email and password' });
    }
    const errors = validationResult(req).array();
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors[0].msg });
    }
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "The email doesn't exists. Please register first",
      });
    }
    const isMatched = await user.matchPasswords(password);
    if (!isMatched) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid credentials' });
    }
    const token = await user.getSignedToken();
    return res.status(200).json({ success: true, token, _id: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
