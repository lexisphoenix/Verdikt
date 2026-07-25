import { describe, expect, it } from "vitest";
import { parseModelJson } from "./parse-model-json";

describe("parseModelJson", () => {
  it("parses clean JSON", () => {
    expect(parseModelJson('{"pass":true,"score":90}')).toEqual({
      pass: true,
      score: 90,
    });
  });

  it("strips markdown fences", () => {
    expect(parseModelJson('```json\n{"pass":false}\n```')).toEqual({
      pass: false,
    });
  });

  it("repairs unescaped quotes in strings", () => {
    const broken = `{"summary":"Uses "military-grade" encryption","score":92}`;
    expect(parseModelJson(broken)).toMatchObject({ score: 92 });
  });
});
