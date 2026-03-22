const Application = require('../models/Application');
const sendEmail   = require('../config/nodemailer');

// ══ SUBMIT APPLICATION ══
// POST /api/applications
const submitApplication = async (req, res) => {
  try {
    const {
      firstName, lastName, email, phone,
      dateOfBirth, nationality, address,
      faculty, program, level, startYear,
      personalStatement, previousQualification, englishScore,
    } = req.body;

    // Check for duplicate application
    const existing = await Application.findOne({ email, program, level });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this program',
      });
    }

    // Create application
    const application = await Application.create({
      firstName, lastName, email, phone,
      dateOfBirth, nationality, address,
      faculty, program, level,
      startYear: startYear || '2025',
      personalStatement,
      previousQualification,
      englishScore,
    });

    // Confirmation email to applicant
    await sendEmail({
      to:      email,
      subject: `Application Received — ${program} | Luminaris University`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1628; color: #faf6ee; padding: 40px; border-radius: 12px;">
          <h1 style="color: #c9a84c; margin-bottom: 4px;">Luminaris University</h1>
          <p style="color: rgba(255,255,255,0.4); font-size: 0.85rem; margin-bottom: 24px;">Office of Admissions</p>
          <hr style="border-color: rgba(201,168,76,0.3); margin-bottom: 28px;"/>
          <h2 style="color: #ffffff;">Application Received! 🎓</h2>
          <p style="color: rgba(255,255,255,0.75); line-height: 1.8;">
            Dear <strong style="color:#c9a84c;">${firstName}</strong>, thank you for applying to Luminaris University.
            We have received your application and our admissions team will review it shortly.
          </p>
          <div style="margin: 28px 0; padding: 24px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.3); border-radius: 10px;">
            <h4 style="color: #c9a84c; margin-bottom: 16px; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase;">Application Summary</h4>
            <table style="width: 100%; color: rgba(255,255,255,0.75);">
              <tr><td style="padding: 6px 0; color: rgba(255,255,255,0.45);">Reference</td><td style="color: #c9a84c; font-weight: 700;">${application.applicationRef}</td></tr>
              <tr><td style="padding: 6px 0; color: rgba(255,255,255,0.45);">Program</td><td>${program}</td></tr>
              <tr><td style="padding: 6px 0; color: rgba(255,255,255,0.45);">Faculty</td><td>${faculty}</td></tr>
              <tr><td style="padding: 6px 0; color: rgba(255,255,255,0.45);">Level</td><td style="text-transform: capitalize;">${level}</td></tr>
              <tr><td style="padding: 6px 0; color: rgba(255,255,255,0.45);">Status</td><td style="color: #4cc982;">Pending Review</td></tr>
            </table>
          </div>
          <p style="color: rgba(255,255,255,0.6); font-size: 0.9rem; line-height: 1.8;">
            Please keep your reference number safe. You will receive updates on your application status via email.
            If you have any questions, please contact <a href="mailto:admissions@luminaris.edu" style="color: #c9a84c;">admissions@luminaris.edu</a>.
          </p>
          <p style="color: rgba(255,255,255,0.35); font-size: 0.8rem; margin-top: 32px;">
            © 2025 Luminaris University. All rights reserved.
          </p>
        </div>
      `,
    });

    // Notification email to admin
    await sendEmail({
      to:      process.env.EMAIL_USER,
      subject: `New Application: ${firstName} ${lastName} — ${program}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1628; color: #faf6ee; padding: 40px; border-radius: 12px;">
          <h1 style="color: #c9a84c;">New Application Received</h1>
          <hr style="border-color: rgba(201,168,76,0.3);"/>
          <table style="width:100%; color:rgba(255,255,255,0.8); margin-top:20px;">
            <tr><td style="padding:8px 0; color:#c9a84c;">Reference</td><td>${application.applicationRef}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c;">Name</td><td>${firstName} ${lastName}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c;">Email</td><td>${email}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c;">Program</td><td>${program}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c;">Faculty</td><td>${faculty}</td></tr>
            <tr><td style="padding:8px 0; color:#c9a84c;">Level</td><td>${level}</td></tr>
          </table>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      data: {
        id:  application._id,
        ref: application.applicationRef,
      },
    });

  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error submitting application',
    });
  }
};

// ══ GET ALL APPLICATIONS (Admin) ══
// GET /api/applications
const getApplications = async (req, res) => {
  try {
    const {
      status, faculty, level,
      page = 1, limit = 20,
      search,
    } = req.query;

    const filter = {};
    if (status)  filter.status  = status;
    if (faculty) filter.faculty = faculty;
    if (level)   filter.level   = level;
    if (search) {
      filter.$or = [
        { firstName:      { $regex: search, $options: 'i' } },
        { lastName:       { $regex: search, $options: 'i' } },
        { email:          { $regex: search, $options: 'i' } },
        { program:        { $regex: search, $options: 'i' } },
        { applicationRef: { $regex: search, $options: 'i' } },
      ];
    }

    const total        = await Application.countDocuments(filter);
    const applications = await Application.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('reviewedBy', 'name email');

    res.status(200).json({
      success: true,
      count:  applications.length,
      total,
      pages:  Math.ceil(total / limit),
      data:   applications,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ GET ONE APPLICATION (Admin) ══
// GET /api/applications/:id
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('reviewedBy', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      data: application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ UPDATE APPLICATION STATUS (Admin) ══
// PATCH /api/applications/:id
const updateApplication = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        status,
        adminNotes,
        reviewedBy: req.user.id,
        reviewedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Send status update email to applicant
    const statusMessages = {
      approved:   { emoji: '🎉', color: '#4cc982', text: 'Congratulations! Your application has been approved.' },
      rejected:   { emoji: '😔', color: '#c94c4c', text: 'After careful consideration, we regret to inform you that your application was not successful.' },
      reviewing:  { emoji: '🔍', color: '#c9a84c', text: 'Your application is currently under review by our admissions committee.' },
      waitlisted: { emoji: '⏳', color: '#a84cc9', text: 'Your application has been placed on our waitlist.' },
    };

    const msg = statusMessages[status];
    if (msg) {
      await sendEmail({
        to:      application.email,
        subject: `Application Update — ${application.program} | Luminaris University`,
        html: `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #0b1628; color: #faf6ee; padding: 40px; border-radius: 12px;">
            <h1 style="color: #c9a84c;">Luminaris University</h1>
            <hr style="border-color: rgba(201,168,76,0.3);"/>
            <h2 style="color: #ffffff;">${msg.emoji} Application Update</h2>
            <p style="color: rgba(255,255,255,0.75); line-height: 1.8;">
              Dear <strong style="color: #c9a84c;">${application.firstName}</strong>,
            </p>
            <p style="color: rgba(255,255,255,0.75); line-height: 1.8;">${msg.text}</p>
            <div style="margin: 24px 0; padding: 16px 24px; border-left: 3px solid ${msg.color}; background: rgba(255,255,255,0.04); border-radius: 0 8px 8px 0;">
              <p style="color: ${msg.color}; font-weight: 700; margin: 0; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 0.1em;">
                Status: ${status.toUpperCase()}
              </p>
            </div>
            ${adminNotes ? `
            <div style="padding: 20px; background: rgba(255,255,255,0.04); border-radius: 8px; margin-top: 16px;">
              <p style="color: rgba(255,255,255,0.45); font-size: 0.8rem; margin-bottom: 8px;">Notes from admissions:</p>
              <p style="color: rgba(255,255,255,0.75);">${adminNotes}</p>
            </div>` : ''}
            <p style="color: rgba(255,255,255,0.35); font-size: 0.8rem; margin-top: 32px;">
              Reference: ${application.applicationRef} — © 2025 Luminaris University
            </p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      message: `Application ${status} successfully`,
      data: application,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// ══ DELETE APPLICATION (Admin) ══
// DELETE /api/applications/:id
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Application deleted successfully',
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = {
  submitApplication,
  getApplications,
  getApplication,
  updateApplication,
  deleteApplication,
};