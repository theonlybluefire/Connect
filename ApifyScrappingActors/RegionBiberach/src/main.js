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
let { url, region } = input;

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

//map regions
switch (region) {
    case 'region-biberach':
        // No specific action needed for this region
        break;
    default:
        console.error(`Unknown region: ${region}... Please check your input.`);
        await Actor.exit();
}

const events = [];

$('ul.veranstaltungen > li').each((i, el) => {
    const eventData = $(el).find("div > div > div");

    const event = {
        name: eventData.find("h3").text().trim(),
        description: eventData.find("p:not([class])").text().trim(),
        added: new Date().toISOString(),
        timeText: eventData.find("p > time").text().trim()
    };

    //upload to firestore
    try {
        db.collection('com.data.regions.biberach').add(event);
    }
    catch (error) {
        console.error("Error uploading to Firestore:", error);
    };

    //push events
    events.push(event);
});

//show results in console
console.log("Results :");
console.table(events);

// Save events to Dataset
await Actor.pushData(events);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit().
await Actor.exit();
