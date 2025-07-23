const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  principalAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  tenure: {
    type: Number,
    required: true
  },
  emiAmount: {
    type: Number,
    required: true
  },
  loanType: {
    type: String,
    enum: ['emi', 'interest-only'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'defaulted'],
    default: 'active'
  },
  remainingPrincipal: {
    type: Number,
    required: true
  },
  paidInstallments: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);