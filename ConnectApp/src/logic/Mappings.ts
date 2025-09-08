import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { EventData } from "../models/EventData";
import { RegionData } from "../models/RegionData";

export function mapQueryToEventData(arg0: DocumentData) {
    return new EventData(
        arg0.name, 
        arg0.description, 
        arg0.region, 
        arg0.added,
        arg0.timeText,
        arg0.fromDay ? new Date(arg0.fromDay) : undefined, 
        arg0.toDay ? new Date(arg0.toDay) : undefined,  
    );
}

export function mapQueryToAvailableRegions(arg0: QuerySnapshot<DocumentData, DocumentData>): RegionData[] {
    let output: RegionData[] = [];
    
    arg0.forEach((doc) => {
        if(doc.data().regionStatus === 1) {
            output.push(new RegionData(doc.data().regionId, doc.data().regionDescription, doc.data().regionStatus));  
        }
    });

    return output;
}