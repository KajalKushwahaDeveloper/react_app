export interface Emulator {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  id: number;
  emulatorName: string;
  emulatorSsid: string;
  fcmToken: string;
  latitude: number;
  longitude: number;
  telephone: string;
  alternateTelephone: string;
  status: string;
  user: User;
  address: string;
  startLat: number;
  startLong: number;
  endLat: number;
  endLong: number;
  speed: number;
  currentTripPointIndex: number;
  tripStatus: string;
  tripTime: number;
  lastUpdatedTripPointTime: string;
}

export interface Authority {
  authority: string;
}

export interface User {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  telephone: string;
  status: string;
  emulatorCount: number;
  authorities: Authority[];
  enabled: boolean;
  username: string;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}

export interface TripData {
  id: string;
  velocity: number;
  distance: number;
  fromAddress: FromAddress[];
  toAddress: ToAddress[];
  tripPoints: TripPoint[];
  stops: Stop[];
}

export interface Address {
  types: string[];
  long_name: string;
  short_name: string;
}

export interface GasStation {
  types: string[];
  long_name: string;
  short_name: string;
}

export interface TripPoint {
  tripPointIndex: number;
  lat: number;
  lng: number;
  bearing: number;
  distance: number;
}

export interface Stop {
  tripPointIndex: number;
  lat: number;
  lng: number;
  bearing: number;
  distance: number;
  address: Address[];
  gasStation: GasStation[];
  tripPoints: TripPoint[];
  reachedTime: string | null;
}

export interface FromAddress {
  types: string[];
  long_name: string;
  short_name: string;
}

export interface ToAddress {
  types: string[];
  long_name: string;
  short_name: string;
}
