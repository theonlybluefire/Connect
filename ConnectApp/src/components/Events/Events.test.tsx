import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Events from "../Events/Events";

describe("Events", () => {
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
      documentId: "",
      bookmarked: false,
      setBookmarked: (_b: boolean) => {},
    },
    {
      name: "Book Flea Market",
      description: "Used books and more",
      region: "Biberach",
      added: new Date().toISOString(),
      timeText: "Date: 05.01.2025 - 06.01.2025",
      fromDay: new Date(2025, 0, 5),
      toDay: new Date(2025, 0, 6),
      categories: ["Market", "Books"],
      documentId: "",
      bookmarked: false,
      setBookmarked: (_b: boolean) => {},
    },
  ];

  it("renders name and description for each event", () => {
    render(<Events events={sampleEvents} />);

    sampleEvents.forEach((ev) => {
      expect(screen.getByText(ev.name)).toBeInTheDocument();
      expect(screen.getByText(ev.description)).toBeInTheDocument();
    });
  });

  it("renders region labels and handles duplicate region values", () => {
    render(<Events events={sampleEvents} />);

    const expectedCounts: Record<string, number> = {};
    sampleEvents.forEach((ev) => {
      expectedCounts[ev.region] = (expectedCounts[ev.region] || 0) + 1;
    });

    Object.entries(expectedCounts).forEach(([region, count]) => {
      const nodes = screen.getAllByText(region);
      expect(nodes.length).toBe(count);
    });
  });

  it("displays categories and localized dates", () => {
    render(<Events events={sampleEvents} />);

    // categories
    sampleEvents.forEach((ev) => {
      ev.categories?.forEach((cat: string) => {
        expect(screen.getByText(cat)).toBeInTheDocument();
      });
    });

    // dates use toLocaleDateString() in component
    sampleEvents.forEach((ev) => {
      if (ev.fromDay) {
        expect(
          screen.getByText(ev.fromDay.toLocaleDateString(), { exact: false })
        ).toBeInTheDocument();
      }
      if (ev.toDay) {
        expect(
          screen.getByText(ev.toDay.toLocaleDateString(), { exact: false })
        ).toBeInTheDocument();
      }
    });
  });

  it("renders nothing for an empty events array", () => {
    render(<Events events={[]} />);
    expect(screen.queryByText("Lakeside Concert")).not.toBeInTheDocument();
  });
});
