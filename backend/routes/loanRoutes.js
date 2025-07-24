const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Save new loan
router.post('/', async (req, res) => {
  try {
    const loan = new Loan({
      ...req.body,
      userId: req.body.userId,
      // loanId will be auto-generated
    });
    
    const savedLoan = await loan.save();
    console.log(`Created new loan with ID: ${savedLoan.loanId}`);
    res.status(201).json(savedLoan);
  } catch (error) {
    console.error('Save loan error:', error);
    res.status(500).json({ message: 'Failed to save loan' });
  }
});

// Get user's loans
router.get('/user/:userId', async (req, res) => {
  try {
    const loans = await Loan.find({ userId: req.params.userId });
    res.json(loans);
  } catch (error) {
    console.error('Get loans error:', error);
    res.status(500).json({ message: 'Failed to fetch loans' });
  }
});

// Get loan by loanId
router.get('/:loanId', async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }
    res.json(loan);
  } catch (error) {
    console.error('Get loan error:', error);
    res.status(500).json({ message: 'Failed to fetch loan' });
  }
});

// Update payment route
router.post('/:loanId/pay', async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });
    
    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // Calculate monthly payment breakdown
    const monthlyInterestRate = loan.interestRate / (12 * 100);
    const interestAmount = loan.remainingPrincipal * monthlyInterestRate;
    const principalPaid = loan.emiAmount - interestAmount;
    
    // Update loan details
    loan.paidInstallments += 1;
    loan.remainingPrincipal = Math.max(0, Number((loan.remainingPrincipal - principalPaid).toFixed(2)));
    
    // Update next due date by adding one month
    const nextDueDate = new Date(loan.nextDueDate || loan.createdAt);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);
    loan.nextDueDate = nextDueDate;

    // Calculate progress percentage
    const progressPercentage = (loan.paidInstallments / loan.tenure) * 100;

    // Check if loan is completed
    if (loan.paidInstallments >= loan.tenure || loan.remainingPrincipal <= 0) {
      loan.status = 'completed';
      loan.remainingPrincipal = 0;
    }

    await loan.save();

    res.json({
      ...loan.toObject(),
      paymentDetails: {
        principalPaid,
        interestPaid: interestAmount,
        remainingPrincipal: loan.remainingPrincipal,
        nextDueDate: loan.nextDueDate,
        paidInstallments: loan.paidInstallments,
        totalInstallments: loan.tenure,
        progressPercentage,
        isCompleted: loan.status === 'completed'
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({ message: 'Failed to process payment' });
  }
});

module.exports = router;