import express from "express";
const router = express.Router();

// Remove "/chat" from the route since we're already using /api/chat in server.js
router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    let reply = "";

    // Basic loan-related responses
    if (message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello")) {
      reply = "Hello! How can I assist you with your loan needs today?";
    } else if (message.toLowerCase().includes("loan")) {
      reply = "I can help you with loan information! You can apply for a loan, check EMI calculations, or view your existing loans.";
    } else if (message.toLowerCase().includes("emi")) {
      reply = "Our EMI calculator can help you plan your loan payments. Would you like to calculate EMI?";
    } else if (message.toLowerCase().includes("interest")) {
      reply = "We offer competitive interest rates starting from 8% per annum. The exact rate depends on your loan type and tenure.";
    } else if (message.toLowerCase().includes("help")) {
      reply = "I can help you with:\n- Loan information\n- EMI calculations\n- Interest rates\n- Application process";
    } else {
      reply = "I'm here to help with your loan-related questions. Feel free to ask about loans, EMI calculations, or interest rates!";
    }

    console.log('Received message:', message); // Add logging
    console.log('Sending reply:', reply); // Add logging

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process message" });
  }
});

export default router;
