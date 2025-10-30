import express from "express";
import dotenv from "dotenv";
import { z } from "zod";
import OpenAI from "openai";

dotenv.config();
const app = express();
app.use(express.json());

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema validation
const summarySchema = z.object({
  transcript: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]).default("user"),
        message: z.string().min(1),
      })
    )
    .min(1),
  include_action_items: z.boolean().optional(),
});

// POST /api/summary
app.post("/api/summary", async (req, res) => {
  try {
    const parsed = summarySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request schema",
        details: parsed.error.errors,
      });
    }

    const { transcript, include_action_items } = parsed.data;

    // Prepare prompt for LLM
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful assistant that summarizes chat conversations concisely.",
      },
      {
        role: "user",
        content: `Summarize the following chat transcript. ${
          include_action_items
            ? "Include a separate 'Action Items' section if any tasks are mentioned."
            : ""
        }\n\n${transcript
          .map((t) => `${t.role.toUpperCase()}: ${t.message}`)
          .join("\n")}`,
      },
    ];

    // Call OpenAI model
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
    });

    const summary = response.choices[0]?.message?.content?.trim();

    res.json({
      summary: summary || "No summary generated.",
    });
  } catch (error) {
    // Handle known OpenAI rate-limit errors
    if (error.status === 429) {
      return res
        .status(429)
        .json({ error: "Rate limit reached. Please try again later." });
    }

    console.error("Unexpected error:", error);
    return res.status(500).json({
      error: "An unexpected error occurred. Please try again later.",
    });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("Summary API is running..");
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
