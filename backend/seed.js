const mongoose  = require('mongoose');
const dotenv    = require('dotenv');
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const User = require('./models/User');
    console.log('✅ User model loaded');

    const News = require('./models/News');
    console.log('✅ News model loaded');

    const Application = require('./models/Application');
    console.log('✅ Application model loaded');

    // ── Create Admin User ──
    const existingAdmin = await User.findOne({ email: 'admin@luminaris.edu' });

    if (!existingAdmin) {
      const admin = await User.create({
        name:     'Luminaris Admin',
        email:    'admin@luminaris.edu',
        password: 'Admin2025!',
        role:     'admin',
      });
      console.log('✅ Admin user created');
      console.log('   Email:    admin@luminaris.edu');
      console.log('   Password: Admin2025!');
    } else {
      console.log('ℹ️  Admin already exists');
    }

    const adminUser = await User.findOne({ email: 'admin@luminaris.edu' });

    // ── Create Sample News ──
    const articles = [
      {
        title:      'Luminaris Team Develops Breakthrough Cancer Detection AI',
        category:   'Research',
        excerpt:    'Our biomedical engineering department has pioneered a new deep-learning model that detects early-stage tumors with 98.7% accuracy.',
        body:       'Full article body placeholder.',
        image:      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80',
        author:     adminUser._id,
        authorName: 'Luminaris Editorial',
        tags:       ['research', 'AI', 'medicine'],
      },
      {
        title:      'New Innovation Hub Opens — A $200M Investment in Our Future',
        category:   'Campus',
        excerpt:    'The newly inaugurated Luminaris Innovation Centre houses 12 cutting-edge labs.',
        body:       'Full article body placeholder.',
        image:      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
        author:     adminUser._id,
        authorName: 'Luminaris Editorial',
        tags:       ['campus', 'innovation'],
      },
      {
        title:      'Luminaris Ranked Number One in Student Satisfaction',
        category:   'Awards',
        excerpt:    'The National University Rankings have placed Luminaris at the top for the third year.',
        body:       'Full article body placeholder.',
        image:      'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?w=800&q=80',
        author:     adminUser._id,
        authorName: 'Luminaris Editorial',
        tags:       ['awards', 'ranking'],
      },
    ];

    let created = 0;
    for (const article of articles) {
      const exists = await News.findOne({ title: article.title });
      if (!exists) {
        await News.create(article);
        created++;
        console.log(`✅ Article created: ${article.title}`);
      } else {
        console.log(`ℹ️  Article exists: ${article.title}`);
      }
    }

    console.log(`\n🎓 Seed complete! ${created} articles created`);
    console.log('   Run: node server.js\n');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seed error:', error.message);
    console.error('❌ Full error:', error);
    process.exit(1);
  }
};

seed();