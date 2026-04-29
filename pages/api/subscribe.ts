// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: "Valid email is required" });
  }

  const API_KEY = process.env.CONVERTKIT_API_KEY;
  const FORM_ID = process.env.CONVERTKIT_FORM_ID;

  if (!API_KEY || !FORM_ID) {
    console.error("ConvertKit credentials not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // Call ConvertKit API to subscribe user
    const response = await fetch(
      `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({
          api_key: API_KEY,
          email: email,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle duplicate subscription gracefully
      if (data.message?.includes("already subscribed")) {
        return res.status(200).json({
          message: "You are already subscribed!",
        });
      }
      return res.status(response.status).json({
        error: data.message || "Subscription failed",
      });
    }

    return res.status(200).json({
      message: "Successfully subscribed! Check your email for confirmation.",
    });
  } catch (error) {
    console.error("ConvertKit error:", error);
    return res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
}
