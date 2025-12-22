import { render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Home from "./Home";

const sampleEvents = [
  {
    name: "Lakeside Concert",
    description: "Open air concert with local bands",
    region: "Biberach",
    added: new Date().toISOString(),
    timeText: "Date: 01.01.2025",
    fromDay: new Date(2025, 0, 1),
    toDay: new Date(2025, 0, 1),
    fromTime: "18:00",
    toTime: "20:00",
    categories: ["Music", "OpenAir"],
    documentId: "1",
    bookmarked: false,
    setBookmarked: (_b: boolean) => {},
  },
];

vi.mock("../../logic/FirestoreLogic", () => {
  return {
    getEventData: vi.fn(async () => sampleEvents),
    getCategoryNames: vi.fn(async () => ["Music", "OpenAir"]),
    getRegionData: vi.fn(async () => [{ id: "biberach", name: "Biberach" }]),
  };
});

vi.mock("../../services/FirebaseServices", () => {
  return {
    FirebaseService: {
      Instance: {
        auth: {
          currentUser: {
            displayName: "Test User",
            email: "test@example.com",
          },
        },
      },
    },
  };
});

import * as FirestoreLogic from "../../logic/FirestoreLogic";

describe("Home", () => {
  const setLoading = vi.fn();
  const setError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    setLoading.mockReset();
    setError.mockReset();
  });

  it("renders and calls firestore service functions", async () => {
    render(<Home setLoading={setLoading} setError={setError} />);

    await waitFor(() => {
      expect(FirestoreLogic.getEventData).toHaveBeenCalled();

      expect(FirestoreLogic.getCategoryNames).toHaveBeenCalled();
      expect(FirestoreLogic.getRegionData).toHaveBeenCalled();
    });
  });
});
