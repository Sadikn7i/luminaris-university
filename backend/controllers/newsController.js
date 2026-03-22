const News = require('../models/News');

// ══ GET ALL NEWS (Public) ══
// GET /api/news
const getAllNews = async (req, res) => {
  try {
    const {
      category, page = 1,
      limit = 9, search,
    } = req.query;

    const filter = { isPublished: true };
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title:   { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags:    { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total   = await News.countDocuments(filter);
    const articles = await News.find(filter)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-body')
      .populate('author', 'name');

    res.status(200).json({
      success: true,
      count:  articles.length,
      total,
      pages:  Math.ceil(total / limit),
      data:   articles,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ GET ONE NEWS ARTICLE (Public) ══
// GET /api/news/:slug
const getNewsArticle = async (req, res) => {
  try {
    const article = await News.findOne({
      slug: req.params.slug,
      isPublished: true,
    }).populate('author', 'name');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Increment views
    article.views += 1;
    await article.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      data: article,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ CREATE NEWS (Admin) ══
// POST /api/news
const createNews = async (req, res) => {
  try {
    const {
      title, category, excerpt,
      body, image, tags, isPublished,
    } = req.body;

    const article = await News.create({
      title, category, excerpt,
      body, image, tags,
      isPublished: isPublished !== undefined ? isPublished : true,
      author:      req.user.id,
      authorName:  req.user.name,
    });

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};

// ══ UPDATE NEWS (Admin) ══
// PUT /api/news/:id
const updateNews = async (req, res) => {
  try {
    const article = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: article,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ DELETE NEWS (Admin) ══
// DELETE /api/news/:id
const deleteNews = async (req, res) => {
  try {
    const article = await News.findByIdAndDelete(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  getAllNews,
  getNewsArticle,
  createNews,
  updateNews,
  deleteNews,
};