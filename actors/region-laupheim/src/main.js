import { Actor } from "apify";
import axios from "axios";
import * as cheerio from "cheerio";

const REGION = "laupheim";

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
  "Actor got url and Apify dataset continuing to scrape data from target website",
);

/*
    Start of individual scraping logic for the target website
*/
$(
  "div.hw_fe__list_wrapper.hwveranstaltung__list_wrapper.hw_fe__list_wrapper--list > div",
).each((i, el) => {
  const name = $(el).find(".hw_record__title span").text().trim();
  const date = $(el)
    .find(".hw_record__date .hw_record__value__text")
    .text()
    .trim();
  const time = $(el)
    .find(".hw_record__time .hw_record__value__text")
    .text()
    .trim();
  const organizer = $(el)
    .find(".hw_record__organizer .hw_record__value__text")
    .text()
    .trim();
  const location = $(el)
    .find(".hw_record__simpleLocation .hw_record__value__text")
    .text()
    .trim();

  //TODO: possibly use later
  const detailLink = $(el).find(".hw_record__more__show").attr("href");
  const mapsLink = $(el).find(".hw_record__map_link--desktop").attr("href");

  events.push({
    name: name,
    description: organizer + " " + location,
    added: new Date().toISOString(),
    timeText: time,
    fromDay: (() => {
      const parts = date.split(".");
      if (parts.length === 3) {
        const [d, m, y] = parts;
        const parsedDate = new Date(y, m - 1, d);
        return isNaN(parsedDate) ? null : parsedDate.toISOString();
      }
      return null;
    })(),
    toDay: (() => {
      const parts = date.split(".");
      if (parts.length === 3) {
        const [d, m, y] = parts;
        const parsedDate = new Date(y, m - 1, d);
        return isNaN(parsedDate) ? null : parsedDate.toISOString();
      }
      return null;
    })(),
    region: REGION,
  });
});
/*
    End of individual scraping logic for the target website
*/

console.log(
  "Scraping finished, got " +
    events.length +
    " events, saving data to the Apify dataset.",
);

await dataset.pushData(events);

await Actor.exit();
