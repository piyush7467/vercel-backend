
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel.js');

// Signup
const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({
      message: 'User already exists',
      success: false

    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });




  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Signup failed"
    });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  req.body.email = email.toLowerCase().trim();

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required"
    })
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({
      message: "Invalid email or password",
      success: false
    });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password", success: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 30 * 60 * 1000
    });



    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })
  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      success: false
    });
  }
};


// Logout Controller
const logout = (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "none"
    });


    res.status(200).json({
      message: "User logged out successfully"
    });
  } catch (err) {
    res.status(500).json({
      message: "Logout failed",
      error: err
    });
  }
};


// Get logged-in user (ME)
const getMe = async (req, res) => {
  try {
    // req.user is set by authMiddleware after JWT verification
    const user = await User.findById(req.user.id).select("_id name email");

    if (!user) {
      return res.status(404).json({
        authenticated: false,
        message: "User not found"
      });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      authenticated: false,
      message: "Failed to fetch user"
    });
  }
};

module.exports = { signup, login, logout, getMe };