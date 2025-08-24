export class EventData {
    name: string;
    description: string;
    region: string;
    added: string;
    fromDay: Date;
    toDay: Date;
    categories?: string[];
    fromTime?: string;
    toTime?: string;

    constructor(
        name: string, 
        description: string, 
        region: string,
        added: string, 
        fromDay:Date, 
        toDay:Date,  
        categories: string[], 
        fromTime?: string, 
        toTime?: string
    ) {
        this.name = name;
        this.description = description;
        this.region = region;
        this.added = added;
        this.fromDay = fromDay;
        this.toDay = toDay;

        //optional
        this.categories = categories;
        this.fromTime = fromTime;
        this.toTime = toTime;
    }
}