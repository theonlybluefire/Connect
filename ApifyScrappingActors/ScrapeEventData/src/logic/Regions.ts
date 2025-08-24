import { CheerioAPI } from "cheerio";
import admin from 'firebase-admin';
import { EventData } from "../models/EventData.js";
import { pushEventDataToFirestore } from "./FirebaseFunctions.js";


//BIBERACH
export function convertToEventBiberach($ :CheerioAPI, db :admin.firestore.Firestore): EventData[] {

    const events: EventData[] = [];

    $('ul.veranstaltungen > li').each((_,el) => {
        const eventData = $(el).find("div > div > div");

        const event = new EventData(
            eventData.find("h3").text().trim(),
            eventData.find("p:not([class])").text().trim(),
            new Date().toISOString(),
            eventData.find("p > time").text().trim()
        );

        //push events to firestore
        pushEventDataToFirestore(
            JSON.parse(JSON.stringify(event)),
            db,
            "com.data.regions.biberach"
        );

        //push events
        events.push(event);
    });

    return events;

}

//LAUPHEIM
//to be done

//ILLERTISSEN
//to be done