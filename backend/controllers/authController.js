const User     = require('../models/User');
const sendEmail = require('../config/nodemailer');

// ── Helper: send token response ──
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJWT();

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:    user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  });
};

// ══ REGISTER ══
// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, country } = req.body;

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone:   phone   || '',
      country: country || '',
    });

    // Send welcome email
    await sendEmail({
      to:      email,
      subject: 'Welcome to Luminaris University',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1628; color: #faf6ee; padding: 40px; border-radius: 12px;">
          <h1 style="color: #c9a84c; font-size: 2rem; margin-bottom: 8px;">Luminaris University</h1>
          <hr style="border-color: rgba(201,168,76,0.3); margin-bottom: 24px;"/>
          <h2 style="color: #ffffff;">Welcome, ${name}! 🎓</h2>
          <p style="color: rgba(255,255,255,0.75); line-height: 1.8;">
            Your Luminaris account has been created successfully.
            You can now track your applications, access resources, and connect with our community.
          </p>
          <a href="${process.env.CLIENT_URL}" 
             style="display:inline-block; margin-top:24px; padding: 14px 32px; background: #c9a84c; color: #0b1628; border-radius: 100px; text-decoration: none; font-weight: 700;">
            Visit Luminaris →
          </a>
          <p style="color: rgba(255,255,255,0.35); font-size: 0.8rem; margin-top: 32px;">
            © 2025 Luminaris University. All rights reserved.
          </p>
        </div>
      `,
    });

    sendTokenResponse(user, 201, res);

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration',
    });
  }
};

// ══ LOGIN ══
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// ══ GET ME ══
// GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ UPDATE PROFILE ══
// PUT /api/auth/me
const updateProfile = async (req, res) => {
  try {
    const { name, phone, country } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, country },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ CHANGE PASSWORD ══
// PUT /api/auth/password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
};