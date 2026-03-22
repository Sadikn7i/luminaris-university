const express = require('express');
const router  = express.Router();

const {
  submitApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
} = require('../controllers/applicationController');

const { protect }   = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// Public
router.post('/', submitApplication);

// Admin only
router.get('/',      protect, adminOnly, getApplications);
router.get('/:id',   protect, adminOnly, getApplication);
router.patch('/:id', protect, adminOnly, updateApplication);
router.delete('/:id',protect, adminOnly, deleteApplication);

module.exports = router;