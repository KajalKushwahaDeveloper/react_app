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
    user: {
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
        authorities: {
            authority: string;
        }[];
        enabled: boolean;
        username: string;
        accountNonExpired: boolean;
        accountNonLocked: boolean;
        credentialsNonExpired: boolean;
    };
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

export interface TripData {
    id: string;
    velocity: number;
    distance: number;
    fromAddress: {
        types: string[];
        long_name: string;
        short_name: string;
    }[];
    toAddress: {
        types: string[];
        long_name: string;
        short_name: string;
    }[];
    tripPoints: {
        tripPointIndex: number;
        lat: number;
        lng: number;
        bearing: number;
        distance: number;
    }[];
    stops: {
        tripPointIndex: number;
        lat: number;
        lng: number;
        bearing: number;
        distance: number;
        address: {
            types: string[];
            long_name: string;
            short_name: string;
        }[];
        gasStation: {
            types: string[];
            long_name: string;
            short_name: string;
        }[];
        tripPoints: {
            tripPointIndex: number;
            lat: number;
            lng: number;
            bearing: number;
            distance: number;
        }[];
        reachedTime: string | null;
    }[];
}

