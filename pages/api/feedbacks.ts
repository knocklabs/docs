// Copied over from knocklabs/control, with the following changes:
// - Removed `withSentry` wrapper from handler
import fetch from "isomorphic-unfetch";

const API_KEY = process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_FEEDBACK_BASE_ID;

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .setHeader("Allow", "POST")
      .json({ error: `${req.method} method is not accepted.` });
  }

  const { feedback_body, source_url } = req.body;

  if (!feedback_body) {
    return res.status(400).json({ error: "Feedback message is required." });
  }
  if (!source_url) {
    return res.status(400).json({ error: "Source URL is required." });
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Feedback`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields: req.body }),
      },
    );

    if (response.status >= 400) {
      return res.status(response.status).json({
        error: "There was an error submitting your feedback.",
      });
    }
    return res.status(201).json({ error: null });
  } catch (error) {
    return res.status(500).json({ error: error.message || error.toString() });
  }
};

export default handler;
