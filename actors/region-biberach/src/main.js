// Apify SDK - toolkit for building Apify Actors (Read more at https://docs.apify.com/sdk/js/).
import { Actor } from "apify";
// Axios - Promise based HTTP client for the browser and node.js (Read more at https://axios-http.com/docs/intro).
import axios from "axios";
// Cheerio - The fast, flexible & elegant library for parsing and manipulating HTML and XML (Read more at https://cheerio.js.org/).
import * as cheerio from "cheerio";

// The init() call configures the Actor for its environment. It's recommended to start every Actor with an init().
await Actor.init();

console.log("Actor started");

const input = await Actor.getInput();
let { url, datasetName } = input;

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
$("ul.veranstaltungen > li").each((i, el) => {
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
    fromDay = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toISOString();

    if (dates.length > 1) {
      const [day, month, year] = dates[1].split(".");
      toDay = new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      ).toISOString();
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
    region: "biberach",
  };

  // push events
  events.push(event);
});
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
