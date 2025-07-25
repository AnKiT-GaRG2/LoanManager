import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import dotenv from 'dotenv';
import emailRouter from './email.js'; 
// Load environment variables
import bodyParser from 'body-parser';
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "*", // or specify "https://loan-manager-six.vercel.app"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes - Fix the order and paths
app.use('/api/auth', authRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/chat', chatRoutes); // Changed from "/api" to "/api/chat"

// MongoDB connection with better error handling
mongoose.connect(process.env.Mongo_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit if database connection fails
});
//to send mail of interest
const borrowerSchema = new mongoose.Schema({
  name: String,
  email: String,
  principalAmount: Number,
  interestRate: Number,
  tenure: Number,
  emi: Number,
  createdAt: { type: Date, default: Date.now },
});

const Borrower = mongoose.model('Borrower', borrowerSchema);
app.use(cors({
  origin: "*", // or specify "https://loan-manager-six.vercel.app"
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(bodyParser.json());

app.use('/api', emailRouter); // ✅ this mounts correctly
// Port configuration
const PORT = process.env.PORT || 5000;

// Start server with error handling
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});