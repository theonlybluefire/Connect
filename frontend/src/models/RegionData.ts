export class RegionData {
    regionId: string;
    regionDescription: string;
    regionStatus: number;

    constructor(
        regionId: string, 
        regionDescription: string, 
        regionStatus: number
    ) {
        this.regionId = regionId;
        this.regionDescription = regionDescription;
        this.regionStatus = regionStatus;
    }
}