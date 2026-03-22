const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  slug:     { type: String, unique: true, lowercase: true },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Research', 'Campus', 'Awards', 'Events', 'Academic', 'Sports', 'International'],
    default: 'Campus',
  },
  excerpt: {
    type: String,
    required: [true, 'Excerpt is required'],
    maxlength: [300, 'Excerpt cannot exceed 300 characters'],
  },
  body:       { type: String, required: [true, 'Body content is required'] },
  image:      { type: String, default: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80' },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, default: 'Luminaris Editorial' },
  tags:       [{ type: String, trim: true }],
  isPublished:{ type: Boolean, default: true },
  views:      { type: Number,  default: 0 },
  publishedAt:{ type: Date,    default: Date.now },
}, { timestamps: true });

// ── Auto-generate slug ──
NewsSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 100)
      + '-' + Date.now();
  }
});
module.exports = mongoose.model('News', NewsSchema);