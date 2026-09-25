const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({
    app: 'AdGenius AI API',
    status: 'running',
    message: 'Use /api/auth or /api/campaigns for app functionality.'
  });
});

// Routes
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);

// Database connection
const startServer = async () => {
  try {
    let uri = process.env.MONGODB_URI;
    let mongoServer;

    console.log('Attempting to connect to:', uri || 'MongoMemoryServer fallback');

    if (!uri) {
      console.log('No MONGODB_URI found, starting MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
    }

    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      console.log('Successfully connected to MongoDB!');
    } catch (primaryError) {
      console.warn('Primary MongoDB connection failed, falling back to MongoMemoryServer...', primaryError.message);
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri(), { serverSelectionTimeoutMS: 3000 });
      console.log('Successfully connected to MongoMemoryServer fallback.');
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

startServer();
