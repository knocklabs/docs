import fetch from "isomorphic-unfetch";

const API_KEY = process.env.INKEEP_API_KEY;

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res
      .status(405)
      .setHeader("Allow", "POST")
      .json({ error: `${req.method} method is not accepted.` });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    const response = await fetch("https://api.inkeep.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "inkeep-rag",
        messages: [{ role: "user", content: query }],
        response_format: {
          type: "json_object",
        },
      }),
    });

    const data = await response.json();

    const results = JSON.parse(
      data.choices[0].message.content ?? { content: [] },
    ).content;

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export default handler;
