// models/Payment.js
import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  loanId: { type: mongoose.Schema.Types.ObjectId, ref: 'Loan', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: Number,
  paymentDate: { type: Date, default: Date.now },
  remainingBalance: Number
});

export default mongoose.model('Payment', paymentSchema);
