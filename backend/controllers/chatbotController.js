import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chatWithBot = async (req, res) => {
  const { message } = req.body;
  const lowerMsg = message.toLowerCase();

  try {
    // ✅ Step 1: Hardcode Greeting
    if (lowerMsg.includes("hello") || lowerMsg.includes("hi")) {
      return res.json({ reply: "👋 Welcome to LoanManager! I can help you with details about EMI Calculator, Loan Tracking, and Borrower Management." });
    }

    // ✅ Step 2: Only answer LoanManager related queries
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
            You are a LoanManager support assistant. 
            You ONLY answer questions related to the LoanManager web app, including:
            - EMI Calculator
            - Loan payment tracking
            - Borrower management
            - Features & usage instructions of LoanManager

            If the question is NOT related to these, strictly reply:
            "Sorry, I don’t have information about this."
          `
        },
        { role: "user", content: message }
      ]
    });

    res.json({ reply: response.choices[0].message.content.trim() });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Chatbot error, please try again." });
  }
};
