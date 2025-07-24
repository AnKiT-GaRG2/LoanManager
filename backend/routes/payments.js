// routes/payments.js
import express from 'express';
import Payment from '../models/Payment.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.params.userId });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
