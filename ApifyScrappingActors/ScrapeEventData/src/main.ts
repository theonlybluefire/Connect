// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/).
import { Actor } from 'apify';
// Axios - Promise based HTTP client for the browser and node.js (Read more at https://axios-http.com/docs/intro).
import axios from 'axios';
// Cheerio - The fast, flexible & elegant library for parsing and manipulating HTML and XML (Read more at https://cheerio.js.org/).
import * as cheerio from 'cheerio';
import { convertToEventBiberach } from './logic/Regions.js';
import { createAdminSdkConnection } from './logic/FirebaseFunctions.js';
import { EventData } from './models/EventData.js';

// this is ESM project, and as such, it requires you to specify extensions in your relative imports
// read more about this here: https://nodejs.org/docs/latest-v18.x/api/esm.html#mandatory-file-extensions
// note that we need to use `.js` even when inside TS files
// import { router } from './routes.js';

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init().
await Actor.init();

interface Input {
    url: string;
    region: string;
}
// Structure of input is defined in input_schema.json
const input = await Actor.getInput<Input>();
if (!input) throw new Error('Input is missing!');
const { url, region } = input;

// Fetch the HTML content of the page.
const response = await axios.get(url);

// Parse the downloaded HTML with Cheerio to enable data extraction.
const $ = cheerio.load(response.data);

//establish Firestore connection
const serviceAccount = JSON.parse(String(process.env.FIREBASE_SERVICE_ACCOUNT_JSON));
const admin = createAdminSdkConnection(serviceAccount);
const firestoreDb = admin.firestore();

let events: EventData[];

//map regions
switch (region) {
    case 'region-biberach':
        events = convertToEventBiberach($, firestoreDb);
        break;
    
    default:
        events = [];

        console.error(`Unknown region: ${region}... Please check your input.`);
        await Actor.exit();
}

// Save headings to Dataset - a table-like storage.
await Actor.pushData(events);

// Gracefully exit the Actor process. It's recommended to quit all Actors with an exit().
await Actor.exit();
