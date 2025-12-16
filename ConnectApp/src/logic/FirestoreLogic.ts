import { COLLECTIONS } from "../constants";
import { EventData } from "../models/EventData";
import { RegionData } from "../models/RegionData";
import { FirestoreService } from "../services/FirebaseService";
export const getEventData = async (): Promise<EventData[]> => {
  return await FirestoreService.getFirestoreCollection<EventData>(
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
            data.fromDay ? new Date(data.fromDay) : undefined,
            data.toDay ? new Date(data.toDay) : undefined
          )
        );
      });
      return events;
    }
  );
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
