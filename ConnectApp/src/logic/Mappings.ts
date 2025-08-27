import { DocumentData } from "firebase/firestore";
import { EventData } from "../models/EventData";

export function mapQueryToEventData(arg0: DocumentData) {
    return new EventData(
        arg0.name, 
        arg0.description, 
        arg0.region, 
        arg0.added,
        arg0.timeText,
        arg0.fromDay ? new Date(arg0.fromDay.seconds * 1000) : undefined, 
        arg0.toDay ? new Date(arg0.toDay.seconds * 1000) : undefined,  
    );
}