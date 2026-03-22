const express      = require('express');
const router       = express.Router();
const { protect }  = require('../middleware/auth');
const { adminOnly }= require('../middleware/adminOnly');
const Application  = require('../models/Application');
const Enquiry      = require('../models/Enquiry');
const News         = require('../models/News');
const User         = require('../models/User');

// All admin routes protected
router.use(protect, adminOnly);

// ══ DASHBOARD STATS ══
// GET /api/admin/stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalApplications,
      pendingApplications,
      approvedApplications,
      rejectedApplications,
      reviewingApplications,
      totalEnquiries,
      unreadEnquiries,
      totalNews,
      totalUsers,
      recentApplications,
      recentEnquiries,
      applicationsByFaculty,
      applicationsByLevel,
    ] = await Promise.all([
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      Application.countDocuments({ status: 'approved' }),
      Application.countDocuments({ status: 'rejected' }),
      Application.countDocuments({ status: 'reviewing' }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({ isRead: false }),
      News.countDocuments({ isPublished: true }),
      User.countDocuments({ role: 'student' }),

      // Recent 5 applications
      Application.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email program status applicationRef createdAt'),

      // Recent 5 enquiries
      Enquiry.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('firstName lastName email subject isRead createdAt'),

      // Applications grouped by faculty
      Application.aggregate([
        { $group: { _id: '$faculty', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),

      // Applications grouped by level
      Application.aggregate([
        { $group: { _id: '$level', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      data: {
        applications: {
          total:     totalApplications,
          pending:   pendingApplications,
          approved:  approvedApplications,
          rejected:  rejectedApplications,
          reviewing: reviewingApplications,
        },
        enquiries: {
          total:  totalEnquiries,
          unread: unreadEnquiries,
        },
        news: {
          total: totalNews,
        },
        users: {
          total: totalUsers,
        },
        charts: {
          byFaculty: applicationsByFaculty,
          byLevel:   applicationsByLevel,
        },
        recent: {
          applications: recentApplications,
          enquiries:    recentEnquiries,
        },
      },
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching stats',
    });
  }
});

// ══ GET ALL USERS ══
// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;

    const filter = { role: 'student' };
    if (search) {
      filter.$or = [
        { name:  { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-password');

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      pages: Math.ceil(total / limit),
      data:  users,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

// ══ TOGGLE USER ACTIVE STATUS ══
// PATCH /api/admin/users/:id/toggle
router.patch('/users/:id/toggle', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: { isActive: user.isActive },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});

module.exports = router;