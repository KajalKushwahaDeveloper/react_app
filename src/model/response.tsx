// interface Model Response for tripData

import { TripData } from "../stores/emulator/types";

export interface TripDataResponse {
    data : TripData,
    status : number,
    statusText : string,
}