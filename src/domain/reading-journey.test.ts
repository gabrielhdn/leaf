import { describe, expect, it } from "vitest";
import {
  assimilateReading,
  changeReadingStatus,
  getGreatWorkStage,
  type ReadingJourney,
} from "./reading-journey";

const start: ReadingJourney = {
  readingStatus: "WANT_TO_READ",
  startedAt: null,
  finishedAt: null,
  assimilatedAt: null,
};

describe("Great Work journey", () => {
  it("derives a stage from reading data without storing a second status", () => {
    expect(getGreatWorkStage(start)).toBe("NIGREDO");

    const reading = changeReadingStatus(start, "READING", new Date("2026-01-01"));
    expect(getGreatWorkStage(reading)).toBe("ALBEDO");

    const finished = changeReadingStatus(reading, "READ", new Date("2026-01-15"));
    expect(getGreatWorkStage(finished)).toBe("CITRINITAS");

    const assimilated = assimilateReading(finished, new Date("2026-01-20"));
    expect(getGreatWorkStage(assimilated)).toBe("RUBEDO");
  });

  it("keeps an abandoned book outside the four stages", () => {
    expect(getGreatWorkStage(changeReadingStatus(start, "ABANDONED"))).toBeNull();
  });

  it("keeps finishing and assimilation separate and prevents early assimilation", () => {
    const reading = changeReadingStatus(start, "READING", new Date("2026-01-01"));
    expect(() => assimilateReading(reading)).toThrow();

    const finished = changeReadingStatus(reading, "READ", new Date("2026-01-15"));
    expect(finished.assimilatedAt).toBeNull();
    expect(finished.finishedAt).toEqual(new Date("2026-01-15"));
  });

  it("clears assimilation when a completed book is reopened", () => {
    const finished = changeReadingStatus(start, "READ", new Date("2026-01-15"));
    const assimilated = assimilateReading(finished, new Date("2026-01-20"));
    const reopened = changeReadingStatus(assimilated, "READING", new Date("2026-02-01"));

    expect(reopened.finishedAt).toBeNull();
    expect(reopened.assimilatedAt).toBeNull();
    expect(getGreatWorkStage(reopened)).toBe("ALBEDO");
  });

  it("keeps assimilation when an already assimilated book remains read", () => {
    const finished = changeReadingStatus(start, "READ", new Date("2026-01-15"));
    const assimilated = assimilateReading(finished, new Date("2026-01-20"));
    const unchanged = changeReadingStatus(assimilated, "READ", new Date("2026-02-01"));

    expect(unchanged.assimilatedAt).toEqual(new Date("2026-01-20"));
    expect(getGreatWorkStage(unchanged)).toBe("RUBEDO");
  });
});
