const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  avatar:    { type: String,  default: '' },
  phone:     { type: String,  default: '' },
  country:   { type: String,  default: '' },
  isActive:  { type: Boolean, default: true },
  lastLogin: { type: Date,    default: null },
}, { timestamps: true });

// ── Hash password before saving ──
// ── Hash password before saving ──
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt    = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Compare password ──
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ── Generate JWT ──
UserSchema.methods.getSignedJWT = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

module.exports = mongoose.model('User', UserSchema);