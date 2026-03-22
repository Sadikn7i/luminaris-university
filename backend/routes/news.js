const express = require('express');
const router  = express.Router();

const {
  getAllNews,
  getNewsArticle,
  createNews,
  updateNews,
  deleteNews,
} = require('../controllers/newsController');

const { protect }   = require('../middleware/auth');
const { adminOnly } = require('../middleware/adminOnly');

// Public
router.get('/',      getAllNews);
router.get('/:slug', getNewsArticle);

// Admin only
router.post('/',     protect, adminOnly, createNews);
router.put('/:id',   protect, adminOnly, updateNews);
router.delete('/:id',protect, adminOnly, deleteNews);

module.exports = router;