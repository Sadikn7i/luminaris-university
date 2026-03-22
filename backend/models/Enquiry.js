const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema({
  // Sender Info
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  phone: {
    type: String,
    default: '',
  },

  // Enquiry Details
  department: {
    type: String,
    enum: [
      'Admissions',
      'Academic Enquiries',
      'Student Services',
      'Research Office',
      'Finance & Fees',
      'Press & Media',
      'Other',
    ],
    default: 'Other',
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters'],
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    minlength: [10, 'Message must be at least 10 characters'],
  },

  // Status
  isRead: {
    type: Boolean,
    default: false,
  },
  isReplied: {
    type: Boolean,
    default: false,
  },
  repliedAt: {
    type: Date,
    default: null,
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },

}, { timestamps: true });

module.exports = mongoose.model('Enquiry', EnquirySchema);