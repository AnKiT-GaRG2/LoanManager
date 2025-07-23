const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');

// Save new loan
router.post('/', async (req, res) => {
  try {
    const loan = new Loan({
      ...req.body,
      userId: req.body.userId
    });
    
    const savedLoan = await loan.save();
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

module.exports = router;