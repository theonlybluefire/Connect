// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/).
import { Actor } from 'apify';
// Axios - Promise based HTTP client for the browser and node.js (Read more at https://axios-http.com/docs/intro).
import axios from 'axios';
// Cheerio - The fast, flexible & elegant library for parsing and manipulating HTML and XML (Read more at https://cheerio.js.org/).
import * as cheerio from 'cheerio';
// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
// import { router } from './routes.js';

import admin from 'firebase-admin';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init().
await Actor.init();

// Structure of input is defined in input_schema.json
const input = await Actor.getInput();
let { url } = input;

//initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Fetch the HTML content of the page.
const response = await axios.get(url);

// Parse the downloaded HTML with Cheerio to enable data extraction.
const $ = cheerio.load(response.data);

const events = [];
const uploadPromises = [];

// delete previos data
const snapshot = await db.collection('com.data.events').where('region', '==', 'biberach').get();
const deletePromises = [];
snapshot.forEach(doc => {
    deletePromises.push(doc.ref.delete());
});
if (deletePromises.length > 0) { //if matching documents found
    await Promise.all(deletePromises);
    console.log(`${deletePromises.length} documents with region "biberach" deleted.`);
} else {
    console.log('No documents with region "biberach" found to delete.');
}


$('ul.veranstaltungen > li').each((i, el) => {
    let fromDay = null;
    let toDay = null;

    const eventData = $(el).find("div > div > div");

    const timeText = eventData.find("p > time").text().trim();

    //format time text
    if (timeText.includes("Datum: ")) {
        const dateRegex = /(\d{2}\.\d{2}\.\d{4})/g;

        const dates = timeText.match(dateRegex);

        if (!dates) {
            fromDay = null;
            toDay = null;
        }

        const [day, month, year] = dates[0].split(".");
        fromDay = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();

        if (dates.length > 1) {
            const [day, month, year] = dates[1].split(".");
            toDay = new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
        } else {
            toDay = fromDay;
        }
    }

    const event = {
        name: eventData.find("h3").text().trim(),
        description: eventData.find("p:not([class])").text().trim(),
        added: new Date().toISOString(),
        timeText: timeText,
        fromDay: fromDay,
        toDay: toDay,
        region: "biberach"
    };

    // upload to firestore und verifiziere Upload
    const uploadPromise = db.collection('com.data.events').add(event)
        .then(docRef => {
            console.log(`document uploaded sucessfully docId:  ${docRef.id}`);
        })
        .catch(error => {
            console.error("Error while uploading document: ", error);
        });

    uploadPromises.push(uploadPromise);

    // push events
    events.push(event);
});

// Wait for all uploads to finish
await Promise.all(uploadPromises);

//show results in console
console.log("Results :");
console.table(events);

// Save events to Dataset
await Actor.pushData(events);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit().
await Actor.exit();
