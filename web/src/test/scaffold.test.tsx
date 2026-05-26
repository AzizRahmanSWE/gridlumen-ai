import { describe, expect, it } from "vitest";
import { MANDATORY_DISCLAIMER } from "../data/types";

describe("F0 contracts", () => {
  it("exposes the mandatory disclaimer constant", () => {
    expect(MANDATORY_DISCLAIMER).toContain("Representative prototype data only");
  });
});
