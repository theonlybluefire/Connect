import { Actor } from "apify";
import axios from "axios";
import * as cheerio from "cheerio";

const REGION = "illertissen";

await Actor.init();

console.log("Actor started");

const input = await Actor.getInput();
const { url, datasetName } = input;

console.log("Actor running with input parameters: ", input);

const response = await axios.get(url);
const $ = cheerio.load(response.data);
const dataset = await Actor.openDataset(datasetName);

let events = [];

console.log(
  "Actor got url and Apify dataset continuing to scrape data from target website"
);

/*
    Start of individual scraping logic for the target website
*/

/*
    End of individual scraping logic for the target website
*/

console.log(
  "Scraping finished, got " +
    events.length +
    " events, saving data to the Apify dataset."
);

await dataset.pushData(events);

await Actor.exit();
