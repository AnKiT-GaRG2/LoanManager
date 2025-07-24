const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  loanId: {
    type: String,
    unique: true,
    required: true,
    default: () => `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  },
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
  },
  nextDueDate: {
    type: Date,
    default: () => new Date()
  }
}, {
  timestamps: true
});

// Add pre-save middleware to ensure unique loanId
loanSchema.pre('save', async function(next) {
  if (this.isNew) {
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      const existingLoan = await mongoose.model('Loan').findOne({ loanId: this.loanId });
      if (!existingLoan) {
        isUnique = true;
      } else {
        this.loanId = `LOAN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        attempts++;
      }
    }
    
    if (!isUnique) {
      next(new Error('Could not generate unique loan ID'));
    }
  }
  next();
});

module.exports = mongoose.model('Loan', loanSchema);