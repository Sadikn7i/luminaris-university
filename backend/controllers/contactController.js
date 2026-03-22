const Enquiry   = require('../models/Enquiry');
const sendEmail = require('../config/nodemailer');

// ══ SUBMIT ENQUIRY ══
// POST /api/contact
const submitEnquiry = async (req, res) => {
  try {
    const {
      firstName, lastName,
      email, phone,
      department, subject, message,
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields',
      });
    }

    // Save to database
    const enquiry = await Enquiry.create({
      firstName, lastName,
      email, phone,
      department, subject, message,
    });

    // Email to admin
    await sendEmail({
      to:      process.env.EMAIL_USER,
      subject: `New Enquiry: ${subject}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1628; color: #faf6ee; padding: 40px; border-radius: 12px;">
          <h1 style="color: #c9a84c;">New Enquiry Received</h1>
          <hr style="border-color: rgba(201,168,76,0.3);"/>
          <table style="width:100%; color:rgba(255,255,255,0.8); margin-top:20px;">
            <tr><td style="padding:8px 0; color:#c9a84c; font-weight:700;">Name</td><td>${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c; font-weight:700;">Email</td><td>${email}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c; font-weight:700;">Phone</td><td>${phone || 'Not provided'}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c; font-weight:700;">Department</td><td>${department || 'Not specified'}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c; font-weight:700;">Subject</td><td>${subject}</td></tr>
          </table>
          <div style="margin-top:20px; padding:20px; background:rgba(255,255,255,0.05); border-radius:8px; border-left: 3px solid #c9a84c;">
            <p style="color:rgba(255,255,255,0.75); line-height:1.8;">${message}</p>
          </div>
          <p style="color:rgba(255,255,255,0.35); font-size:0.8rem; margin-top:32px;">
            Enquiry ID: ${enquiry._id} — ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    // Confirmation email to user
    await sendEmail({
      to:      email,
      subject: 'We received your enquiry — Luminaris University',
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1628; color: #faf6ee; padding: 40px; border-radius: 12px;">
          <h1 style="color: #c9a84c;">Luminaris University</h1>
          <hr style="border-color: rgba(201,168,76,0.3);"/>
          <h2 style="color: #ffffff;">Thank you, ${firstName}!</h2>
          <p style="color: rgba(255,255,255,0.75); line-height: 1.8;">
            We have received your enquiry regarding <strong style="color:#c9a84c;">"${subject}"</strong>.
            A member of our ${department || 'team'} will get back to you within one business day.
          </p>
          <div style="margin-top:24px; padding:20px; background:rgba(255,255,255,0.05); border-radius:8px;">
            <p style="color:rgba(255,255,255,0.5); font-size:0.85rem;">Your message:</p>
            <p style="color:rgba(255,255,255,0.75);">${message}</p>
          </div>
          <p style="color: rgba(255,255,255,0.35); font-size: 0.8rem; margin-top: 32px;">
            © 2025 Luminaris University. All rights reserved.
          </p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Your enquiry has been received. We will get back to you shortly!',
      data: { id: enquiry._id },
    });

  } catch (error) {
    console.error('Contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error — could not submit enquiry',
    });
  }
};

// ══ GET ALL ENQUIRIES (Admin) ══
// GET /api/contact
const getEnquiries = async (req, res) => {
  try {
    const { isRead, department, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (department) filter.department = department;

    const total    = await Enquiry.countDocuments(filter);
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count:  enquiries.length,
      total,
      pages:  Math.ceil(total / limit),
      data:   enquiries,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ MARK AS READ (Admin) ══
// PATCH /api/contact/:id/read
const markAsRead = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ DELETE ENQUIRY (Admin) ══
// DELETE /api/contact/:id
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Enquiry deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  submitEnquiry,
  getEnquiries,
  markAsRead,
  deleteEnquiry,
};