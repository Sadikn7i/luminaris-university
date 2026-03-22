const express = require('express');
const router  = express.Router();

const {
  submitEnquiry,
  getEnquiries,
  markAsRead,
  deleteEnquiry,
} = require('../controllers/contactController');

const { protect }    = require('../middleware/auth');
const { adminOnly }  = require('../middleware/adminOnly');

// Public
router.post('/', submitEnquiry);

// Admin only
router.get('/',           protect, adminOnly, getEnquiries);
router.patch('/:id/read', protect, adminOnly, markAsRead);
router.delete('/:id',     protect, adminOnly, deleteEnquiry);

module.exports = router;