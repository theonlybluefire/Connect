import { getDocs, collection, Firestore } from "firebase/firestore";
import { EventData } from "../models/EventData";
import { mapQueryToAvailableRegions, mapQueryToEventData } from "./Mappings";

export const EVENT_DATA_COLLECTION = "com.data.events";
export const REGION_DATA_COLLECTION = "com.configs.availableRegions";

export const getEventData = async (db: Firestore): Promise<EventData[]> => {
    let eventsList: EventData[] = [];

    const querySnapshot = await getDocs(collection(db, EVENT_DATA_COLLECTION));
    querySnapshot.forEach((doc) => {
      eventsList.push(mapQueryToEventData(doc.data()));
    });

    return eventsList;
}

export const getAvailableRegionNames = async (db: Firestore): Promise<string[]> => {
    let regions: string[] = [];

    const querySnapshot = await getDocs(collection(db, REGION_DATA_COLLECTION));
    mapQueryToAvailableRegions(querySnapshot).forEach((region) => {
        regions.push(region.regionDescription);
    });

    return regions;
}