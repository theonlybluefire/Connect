export class EventData {
  name: string;
  description: string;
  region: string;
  added: Date;
  timeText: string;
  documentId: string;
  bookmarked: boolean = false;
  fromDay?: Date;
  toDay?: Date;
  fromTime?: string;
  toTime?: string;
  website?: string;
  categories?: string[];

  constructor(
    name: string,
    description: string,
    region: string,
    added: Date,
    timeText: string,
    documentId: string,
    fromDay?: Date,
    toDay?: Date,
    categories?: string[],
    fromTime?: string,
    toTime?: string,
    website?: string,
  ) {
    this.name = name;
    this.description = description;
    this.region = region;
    this.added = added;
    this.fromDay = fromDay;
    this.toDay = toDay;
    this.timeText = timeText;
    this.documentId = documentId;

    //optional
    this.categories = categories;
    this.fromTime = fromTime;
    this.toTime = toTime;
    this.website = website;
  }

  public setBookmarked(isBookmarked: boolean) {
    this.bookmarked = isBookmarked;
  }

  public static getRemovableBookmarkedEvents(
    bookmarkedEvents: EventData[],
  ): EventData[] {
    const removable: EventData[] = [];

    bookmarkedEvents.forEach((event) => {
      if (event.isBookmarkRemovable()) {
        removable.push(event);
      }
    });

    return removable;
  }

  public isBookmarkRemovable() {
    const today = new Date();

    if (
      this.fromDay &&
      this.fromDay.getTime() < today.getTime() &&
      this.bookmarked
    ) {
      return true;
    }
    return false;
  }
}
