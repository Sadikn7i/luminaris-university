const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'], trim: true },
  lastName:  { type: String, required: [true, 'Last name is required'],  trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
  },
  phone:       { type: String, required: [true, 'Phone number is required'] },
  dateOfBirth: { type: Date,   default: null },
  nationality: { type: String, default: '' },
  address:     { type: String, default: '' },

  faculty: {
    type: String,
    required: [true, 'Faculty is required'],
    enum: [
      'Sciences & Engineering',
      'Business & Economics',
      'Arts & Humanities',
      'Medicine & Health',
      'Law & Social Sciences',
      'Technology & AI',
      'Environment & Sustainability',
      'Education & Leadership',
    ],
  },
  program:   { type: String, required: [true, 'Program is required'], trim: true },
  level: {
    type: String,
    required: [true, 'Study level is required'],
    enum: ['undergraduate', 'postgraduate', 'phd'],
  },
  startYear: { type: String, default: '2025' },

  personalStatement:     { type: String, required: [true, 'Personal statement is required'], minlength: [10, 'Too short'] },
  previousQualification: { type: String, default: '' },
  englishScore:          { type: String, default: '' },

  status: {
    type: String,
    enum: ['pending', 'reviewing', 'approved', 'rejected', 'waitlisted'],
    default: 'pending',
  },
  adminNotes:  { type: String, default: '' },
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt:  { type: Date, default: null },
  applicationRef: { type: String, unique: true },

}, { timestamps: true });

ApplicationSchema.pre('save', function () {
  if (!this.applicationRef) {
    const year   = new Date().getFullYear();
    const random = Math.floor(Math.random() * 900000) + 100000;
    this.applicationRef = `LUM-${year}-${random}`;
  }
});

module.exports = mongoose.model('Application', ApplicationSchema);