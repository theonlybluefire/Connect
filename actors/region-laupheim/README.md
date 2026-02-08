# Introduction

- Apify Actor used to scrape data for the Connect App

# Developing the actors logic

## Quick Start Guide

_This Quick Start Guide explains how to setup an Apify Actor thats scrapes events from regional websites and pushes them to the Connect App._

- [x] Copy this template
- [x] Change package names in the `package.json`, `actor.json` files (replace `[region]` with the region of the scraper)
- [x] Create a `input.json` file containing the actors configuration as a json object (see `input_schema.json`)
- [x] Install a dependencies using `npm install`
- [x] Set the `REGION` constant to the region of the actor
- [x] Implement the actors scraping logic inside the declared positions (Events need to follow a specific format specified below)

## Important notes

- The actor **NEEDS** to write a list of objects to the dataset in the following format

```json
{
  "name": "Name of the event",
  "description": "Description of the event",
  "added": "When the event was created (Timestamp)",
  "timeText": "Additional information containing the specific time the event takes place in ",
  "fromDay": "Day the event starts",
  "toDay": "Day the event ends",
  "region": "Region of the event (Use the REGION constant)"
}
```

# Running the actor locally

To test the actor locally run

```bash
apify run --input-file input.json
```

_Make sure the input-file contains the necessary data_
