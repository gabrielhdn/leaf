export const readingStatuses = [
  "WANT_TO_READ",
  "READING",
  "READ",
  "ABANDONED",
] as const;

export type ReadingStatus = (typeof readingStatuses)[number];
export type GreatWorkStage = "NIGREDO" | "ALBEDO" | "CITRINITAS" | "RUBEDO";
export const greatWorkStages: GreatWorkStage[] = ["NIGREDO", "ALBEDO", "CITRINITAS", "RUBEDO"];

export type ReadingJourney = {
  readingStatus: ReadingStatus;
  startedAt: Date | null;
  finishedAt: Date | null;
  assimilatedAt: Date | null;
};

export function getGreatWorkStage(
  journey: Pick<ReadingJourney, "readingStatus" | "assimilatedAt">,
): GreatWorkStage | null {
  if (journey.readingStatus === "ABANDONED") return null;
  if (journey.assimilatedAt) return "RUBEDO";
  if (journey.readingStatus === "READ") return "CITRINITAS";
  if (journey.readingStatus === "READING") return "ALBEDO";
  return "NIGREDO";
}

export function changeReadingStatus(
  current: ReadingJourney,
  nextStatus: ReadingStatus,
  at: Date = new Date(),
): ReadingJourney {
  switch (nextStatus) {
    case "WANT_TO_READ":
      return {
        readingStatus: nextStatus,
        startedAt: null,
        finishedAt: null,
        assimilatedAt: null,
      };
    case "READING":
      return {
        readingStatus: nextStatus,
        startedAt: current.startedAt ?? at,
        finishedAt: null,
        assimilatedAt: null,
      };
    case "READ":
      return {
        readingStatus: nextStatus,
        startedAt: current.startedAt,
        finishedAt:
          current.readingStatus === "READ" ? (current.finishedAt ?? at) : at,
        assimilatedAt:
          current.readingStatus === "READ" ? current.assimilatedAt : null,
      };
    case "ABANDONED":
      return {
        readingStatus: nextStatus,
        startedAt: current.startedAt,
        finishedAt: null,
        assimilatedAt: null,
      };
  }
}

export function assimilateReading(
  current: ReadingJourney,
  at: Date = new Date(),
): ReadingJourney {
  if (current.readingStatus !== "READ") {
    throw new Error("Only a finished book can be assimilated");
  }

  return {
    ...current,
    assimilatedAt: current.assimilatedAt ?? at,
  };
}
