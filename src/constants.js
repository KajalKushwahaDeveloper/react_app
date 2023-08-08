export const MY_CONSTANT_STRING = "Hello, World!";
export const LOCAL_API = "http://192.168.1.125:8080";
export const LOCAL_API_2 = "http://192.168.1.137:8080";
export const LIVE_API = "http://64.226.101.239:8080";
export const LIVE_API_CLIENT = "http://149.28.69.114:8080";

export const BASE_URL = LIVE_API_CLIENT;

//BASE
export const RESET_PASSWORD = BASE_URL + "/reset-password";
export const CLIENT_CURRENT = BASE_URL + "/current";
export const CLIENT_LOGIN = BASE_URL + "/log-in";

//ADMIN
export const ADMIN_URL = BASE_URL + "/admin";
export const ADMIN_LOGIN = ADMIN_URL + "/log-in";
export const ADMIN_CURRENT = ADMIN_URL + "/current";

//EMULATOR
export const EMULATOR_URL = BASE_URL + "/emulator";
export const EMULATOR_DELETE_URL = EMULATOR_URL;
export const EMULATOR_TELEPHONE_UPDATE_URL = EMULATOR_URL + "/updatePhoneNumber";
export const EMULATOR_DRAG_URL = EMULATOR_URL + "/dragEmulator";

//USER
export const USER_URL = BASE_URL + "/user";
export const USER_CHANGE_STATUS_URL = USER_URL + "/change-status";


//USER ASSIGN EMULATOR
export const USER_ASSIGN_EMULATOR_URL = BASE_URL + "/user-assign-emulator";

//DOWNLOAD
export const DOWNLOAD_APK_URL = BASE_URL + "/download";
export const COPY_DOWNLOAD_APK_URL = DOWNLOAD_APK_URL + "/apkLink";


//TRIP
export const TRIP_URL = BASE_URL + "/trip";
export const TRIP_POINTS_URL = TRIP_URL + "/trip-points";
export const CREATE_TRIP_URL = TRIP_URL + "/create";
export const TRIP_STOPS_URL = TRIP_URL + "/stops";
export const TRIP_TOGGLE = TRIP_URL + "/toggle";
export const TRIP_HISTORY = TRIP_URL + "/history";