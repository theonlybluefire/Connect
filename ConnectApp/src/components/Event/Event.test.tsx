import { IonApp } from "@ionic/react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EventData } from "../../models/EventData";
import Event from "./Event";

describe("Event", () => {
  const sampleEvent = new EventData(
    "Lakeside Concert",
    "Open air concert with local bands",
    "Biberach",
    new Date().toISOString(),
    "Date: 01.01.2025",
    "0"
  );

  it("renders necessary event data", () => {
    render(
      <IonApp>
        <Event
          event={sampleEvent}
          bookmarkEvent={function (event: EventData): void {
            /* noop */
          }}
        />
      </IonApp>
    );

    expect(screen.getByText(sampleEvent.name)).toBeInTheDocument();
    expect(screen.getByText(sampleEvent.description)).toBeInTheDocument();
    expect(screen.getByText(sampleEvent.region)).toBeInTheDocument();
    expect(screen.getByText("Date: 01.01.2025")).toBeInTheDocument();
  });

  it("calls bookmarkEvent when bookmark button is clicked", () => {
    const bookmarkMock = vi.fn();

    render(
      <IonApp>
        <Event event={sampleEvent} bookmarkEvent={bookmarkMock} />
      </IonApp>
    );

    const button = screen.getByTestId("bookmark");
    expect(button).toBeInTheDocument();
    button.click();

    expect(bookmarkMock).toHaveBeenCalledOnce();
    expect(bookmarkMock).toHaveBeenCalledWith(sampleEvent);
  });

  it("renders categories and localized from/to dates when provided", () => {
    const from = new Date(2025, 0, 1);
    const to = new Date(2025, 0, 2);

    const eventWithDetails = {
      name: "Book Flea Market",
      description: "Used books and more",
      region: "Ulm",
      added: new Date().toISOString(),
      timeText: "",
      fromDay: from,
      toDay: to,
      fromTime: "10:00",
      toTime: "16:00",
      categories: ["Market", "Books"],
      documentId: "2",
      bookmarked: false,
      setBookmarked: (_b: boolean) => {},
    } as unknown as EventData;

    render(
      <IonApp>
        <Event event={eventWithDetails} bookmarkEvent={() => {}} />
      </IonApp>
    );

    expect(screen.getByText("Market")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();

    expect(
      screen.getByText(from.toLocaleDateString(), { exact: false })
    ).toBeInTheDocument();
    expect(
      screen.getByText(to.toLocaleDateString(), { exact: false })
    ).toBeInTheDocument();

    expect(screen.getByText("10:00", { exact: false })).toBeInTheDocument();
  });
});
