import type { NextApiRequest, NextApiResponse } from "next";

// Must use server-side INKEEP_API_KEY with Chat API access
// The NEXT_PUBLIC_INKEEP_API_KEY is a widget key and won't work for the Chat Completions API
const API_KEY = process.env.INKEEP_API_KEY;

if (!API_KEY) {
  console.warn(
    "Warning: INKEEP_API_KEY not found. The Chat API requires a server-side API key with Chat API access (not the widget key)."
  );
}

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequest = {
  messages: Message[];
  conversationId?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .setHeader("Allow", "POST")
      .json({ error: `${req.method} method is not accepted.` });
  }

  const { messages, conversationId }: ChatRequest = req.body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required." });
  }

  if (!API_KEY) {
    return res.status(500).json({ 
      error: "INKEEP_API_KEY is not configured. The Chat API requires a server-side API key with Chat API access." 
    });
  }

  try {
    // Set up SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no"); // Disable buffering for nginx

    // Use native fetch for streaming support (available in Node.js 18+)
    const response = await fetch("https://api.inkeep.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "inkeep-qa-gpt-5.2",
        messages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Inkeep API error:", response.status, errorData);
      // Reset headers if we haven't started streaming
      res.setHeader("Content-Type", "application/json");
      return res.status(response.status).json({ error: errorData });
    }

    if (!response.body) {
      return res.status(500).json({ error: "No response body from Inkeep API." });
    }

    // Pipe the stream from Inkeep directly to the client
    const reader = response.body.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        // Forward the raw bytes directly without any modification
        res.write(Buffer.from(value));
      }
    } finally {
      reader.releaseLock();
    }

    res.end();
  } catch (error) {
    console.error("Chat API error:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: (error as Error).message });
    }
    // If headers are already sent, try to send an error event
    res.write(`data: ${JSON.stringify({ error: (error as Error).message })}\n\n`);
    res.end();
  }
};

export default handler;
