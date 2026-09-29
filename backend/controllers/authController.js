const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Scheme = require('../models/Scheme');
const generateToken = require('../utils/generateToken');

const sanitizeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  savedSchemes: user.savedSchemes,
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'admin' ? 'citizen' : role || 'citizen',
    });

    res.status(201).json({
      token: generateToken(user),
      role: user.role,
      user: sanitizeUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'User already exists with this email' });
    }
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({
      token: generateToken(user),
      role: user.role,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedSchemes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const { schemeId } = req.params;

    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ message: 'Scheme not found' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const alreadySaved = user.savedSchemes.some(
      (id) => id.toString() === schemeId
    );

    if (alreadySaved) {
      user.savedSchemes = user.savedSchemes.filter(
        (id) => id.toString() !== schemeId
      );
    } else {
      user.savedSchemes.push(scheme._id);
    }

    await user.save();
    await user.populate('savedSchemes');

    res.status(200).json({
      bookmarked: !alreadySaved,
      savedSchemes: user.savedSchemes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update bookmark', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  toggleBookmark,
};
