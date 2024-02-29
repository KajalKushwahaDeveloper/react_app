import { Emulator, FromAddress, ToAddress, Address, GasStation, TripData, Stop, TripPoint } from "./types";

import { Geodesic, GeodesicClass } from "geographiclib-geodesic";

export interface SelectedEmulatorData {
  emulatorDetails: Emulator;
  id: string;
  historyId: string;
  velocity: number;
  distance: number;
  time: number;
  length: number;
  cost: number;
  fromAddress: FromAddress[];
  toAddress: ToAddress[];
  shape: string;
  stops: SelectedEmulatorStop[];
  event: string;
}

export interface SelectedEmulatorStop {
  tripPointIndex: number;
  lat: number;
  lng: number;
  bearing: number;
  distance: number;
  address: Address[];
  gasStation: GasStation[];
  shape: string;
  waitTime: number;
  reachedTime: string | null;
}

export function toTripData(data: SelectedEmulatorData): TripData {
  const tripData: TripData = {
    emulatorDetails: data.emulatorDetails,
    id: data.id,
    historyId: data.historyId,
    velocity: data.velocity,
    distance: data.distance,
    time: data.time,
    length: data.length,
    cost: data.cost,
    fromAddress: data.fromAddress,
    toAddress: data.toAddress,
    shape: data.shape,
    stops: data.stops.map((stop) => {
      const stopPoints: Stop = {
        tripPointIndex: stop.tripPointIndex,
        lat: stop.lat,
        lng: stop.lng,
        bearing: stop.bearing,
        distance: stop.distance,
        address: stop.address,
        gasStation: stop.gasStation,
        tripPoints: generateTripPoint(stop.shape),
        waitTime: stop.waitTime,
        reachedTime: stop.reachedTime,
      };
      return stopPoints;
    }),
    tripPoints: generateTripPoint(data.shape),
  };

  return tripData;
}

function generateTripPoint(str: string): TripPoint[] {
  // list of TripPoints
  const tripPoints: TripPoint[] = [];

  var index = 0,
    lat = 0,
    lng = 0,
    shift = 0,
    result = 0,
    byte: number | null = null,
    latitude_change: number,
    longitude_change: number,
    factor = Math.pow(10, 6);

  var prevLat = 0, prevLng = 0, distance = 0, tripPointIndex = 0;

  // Coordinates have variable length when encoded, so just keep
  // track of whether we've hit the end of the string. In each
  // loop iteration, a single coordinate is decoded.
  while (index < str.length) {

    // Reset shift, result, and byte
    byte = null;
    shift = 0;
    result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    shift = result = 0;

    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

    lat += latitude_change;
    lng += longitude_change;
    if (tripPoints.length > 0) {
      distance = calculateDistance(prevLat, prevLng, lat / factor, lng / factor);
    }
    if (distance > 100) {
      tripPointIndex = getTripPointSubIndexes(distance, 0, prevLat, prevLng, lat / factor, lng / factor, tripPoints, tripPointIndex)
    } else {
      const tripPoint: TripPoint = {
        tripPointIndex: tripPointIndex++,
        lat: lat / factor,
        lng: lng / factor,
        bearing: 0,
        distance: distance,
      };
      tripPoints.push(tripPoint);
    }
    prevLat = lat / factor;
    prevLng = lng / factor;
  }

  return tripPoints;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const geod: GeodesicClass = Geodesic.WGS84;
  const distance : any = geod.Inverse(lat1, lon1, lat2, lon2).s12;
  return distance; // In meters
}

function getTripPointSubIndexes(distance: number, bearing: number, prevLat: number, prevLng: number, nextLat: number, nextLng: number, tripPoints: TripPoint[], tripPointIndex: number): number {
  const numPoints = Math.floor(distance / 100);
  const latIncrement = (nextLat - prevLat) / numPoints;
  const lngIncrement = (nextLng - prevLng) / numPoints;
  // loop through numPoints
  for (let i = 0; i < numPoints; i++) {
    const newLat = prevLat + (i * latIncrement);
    const newLng = prevLng + (i * lngIncrement);
    const tripPoint: TripPoint = {
      tripPointIndex: tripPointIndex++,
      lat: newLat,
      lng: newLng,
      bearing: bearing,
      distance: 100,
    };
    tripPoints.push(tripPoint);
  }

  if (distance > 0) {
    const tripPoint: TripPoint = {
      tripPointIndex: tripPointIndex++,
      lat: nextLat,
      lng: nextLng,
      bearing: bearing,
      distance: distance,
    };
    tripPoints.push(tripPoint);
  }
  return tripPointIndex
}