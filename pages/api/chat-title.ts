import type { NextApiRequest, NextApiResponse } from "next";

// Must use server-side INKEEP_API_KEY with Chat API access
const API_KEY = process.env.INKEEP_API_KEY;

if (!API_KEY) {
  console.warn(
    "Warning: INKEEP_API_KEY not found. The Chat API requires a server-side API key with Chat API access.",
  );
}

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatTitleRequest = {
  messages: Message[];
};

// Sanitize and truncate title to ensure it's short (3-5 words max)
function sanitizeTitle(rawTitle: string, fallbackContent: string): string {
  // Remove quotes, markdown links, and extra whitespace
  let title = rawTitle
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Remove markdown links, keep text
    .replace(/["[\]()]/g, "") // Remove quotes and brackets
    .replace(/\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();

  // If the title is too long (more than 50 chars or 7 words), truncate it
  const words = title.split(" ");
  if (title.length > 50 || words.length > 7) {
    // Take first 5 words
    title = words.slice(0, 5).join(" ");
  }

  // If still empty or too long, use fallback from user message
  if (!title || title.length > 50) {
    // Extract first few words from user message
    const fallbackWords = fallbackContent
      .replace(/["[\]()]/g, "")
      .split(/\s+/)
      .slice(0, 5)
      .join(" ");
    title =
      fallbackWords.length > 40
        ? fallbackWords.substring(0, 40) + "..."
        : fallbackWords;
  }

  // Capitalize first letter
  if (title.length > 0) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return title || "New chat";
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
  if (req.method !== "POST") {
    return res
      .status(405)
      .setHeader("Allow", "POST")
      .json({ error: `${req.method} method is not accepted.` });
  }

  const { messages }: ChatTitleRequest = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  if (!API_KEY) {
    return res.status(500).json({
      error:
        "INKEEP_API_KEY is not configured. The Chat API requires a server-side API key with Chat API access.",
    });
  }

  try {
    // Use the first user message to generate a title
    const firstUserMessage = messages.find((m) => m.role === "user");

    if (!firstUserMessage) {
      return res
        .status(400)
        .json({ error: "At least one user message is required." });
    }

    // Generate title from the user's question
    // The Inkeep API is a RAG API, so we ask it to summarize the topic
    const titlePrompt = `In exactly 3-5 words, what is the main topic of this question? Only respond with the topic, no explanation or punctuation.

Question: "${firstUserMessage.content}"

Topic:`;

    const response = await fetch("https://api.inkeep.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "inkeep-qa-gpt-5.2",
        messages: [{ role: "user", content: titlePrompt }],
        max_tokens: 15,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Inkeep API error:", response.status, errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    let title = data.choices[0]?.message?.content?.trim() || "";

    // Post-process to ensure title is short
    title = sanitizeTitle(title, firstUserMessage.content);

    return res.status(200).json({ title });
  } catch (error) {
    console.error("Chat title API error:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}

export default handler;
