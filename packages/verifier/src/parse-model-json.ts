import { jsonrepair } from "jsonrepair";

/** Parse LLM JSON output, tolerating fences and minor formatting issues. */
export function parseModelJson(raw: string): unknown {
  let text = raw.trim();
  if (!text) throw new Error("Verifier returned empty JSON");

  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  if (fenced) text = fenced[1].trim();

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start >= 0 && end > start) {
    text = text.slice(start, end + 1);
  }

  try {
    return JSON.parse(text);
  } catch {
    return JSON.parse(jsonrepair(text));
  }
}
