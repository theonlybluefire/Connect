export class EventData {
    name: string;
    description: string;
    added: string;
    timeText: string;

    constructor(name: string, description: string, added: string, timeText: string) {
        this.name = name;
        this.description = description;
        this.added = added;
        this.timeText = timeText;
    }
}