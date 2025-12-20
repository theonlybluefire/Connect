import { COLLECTIONS } from "../constants";
import { EventData } from "../models/EventData";
import { RegionData } from "../models/RegionData";
import { FirestoreService, UserService } from "../services/FirebaseServices";
export const getEventData = async (): Promise<EventData[]> => {
  const bookmarkedIds: string[] =
    (await UserService.getUserData("bookmarked")) || [];

  const data = await FirestoreService.getFirestoreCollection<EventData>(
    COLLECTIONS.EVENTS,
    (querySnapshot) => {
      let events: EventData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        events.push(
          new EventData(
            data.name,
            data.description,
            data.region,
            data.added,
            data.timeText,
            doc.id,
            data.fromDay ? new Date(data.fromDay) : undefined,
            data.toDay ? new Date(data.toDay) : undefined
          )
        );
        if (bookmarkedIds.includes(doc.id)) events.at(-1)?.setBookmarked(true);
      });

      console.log(events);
      return events;
    }
  );

  return data;
};

export const getRegionData = async (): Promise<RegionData[]> => {
  return FirestoreService.getFirestoreCollection<RegionData>(
    COLLECTIONS.REGIONS,
    (querySnapshot) => {
      let regions: RegionData[] = [];

      querySnapshot.forEach((doc) => {
        regions.push(
          new RegionData(
            doc.data().regionId,
            doc.data().regionDescription,
            doc.data().regionStatus
          )
        );
      });
      return regions;
    }
  );
};

export const getCategoryNames = async (): Promise<string[]> => {
  return FirestoreService.getFirestoreCollection<string>(
    COLLECTIONS.EVENTS,
    (querySnapshot) => {
      let categoriesSet: Set<string> = new Set<string>();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.categories && Array.isArray(data.categories)) {
          data.categories.forEach((cat: string) => categoriesSet.add(cat));
        }
      });
      return Array.from(categoriesSet);
    }
  );
};

export const bookmarkEvent = async (eventId: string): Promise<void> => {
  let bookmarkedEvents: Set<String> = new Set(
    (await UserService.getUserData("bookmarked")) || []
  );

  if (bookmarkedEvents.has(eventId)) {
    bookmarkedEvents.delete(eventId);
  } else {
    bookmarkedEvents.add(eventId);
  }

  UserService.pushUserData("bookmarked", Array.from(bookmarkedEvents));
};

export const loadBookmarkedEvents = async (): Promise<EventData[]> => {
  const bookmarkedEvents: string[] = await UserService.getUserData(
    "bookmarked"
  );
  if (!bookmarkedEvents) return [];
  const eventData = await FirestoreService.getFirestoreDocuments(
    COLLECTIONS.EVENTS,
    bookmarkedEvents
  );

  let events: EventData[] = [];

  eventData.forEach((doc) => {
    const data = doc.data();
    if (!data) return;
    events.push(
      new EventData(
        data.name,
        data.description,
        data.region,
        data.added,
        data.timeText,
        doc.id,
        data.fromDay ? new Date(data.fromDay) : undefined,
        data.toDay ? new Date(data.toDay) : undefined
      )
    );
  });

  return events;
};
