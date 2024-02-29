export const LOCAL_SPRING_URL = "http://localhost:8080"

export const LIVE_AWS_SPRING_URL_HTTP = "http://react-app-lb-260499273.us-east-1.elb.amazonaws.com:8080"
export const LIVE_AWS_SPRING_URL_HTTP_LB = "http://logbookgps.com:8080"

export const LIVE_AWS_SPRING_URL_HTTPS = "https://react-app-lb-260499273.us-east-1.elb.amazonaws.com:8081"
export const LIVE_AWS_SPRING_URL_HTTPS_LB = "https://logbookgps.com:8081"

export const BASE_URL = LIVE_AWS_SPRING_URL_HTTPS_LB;

//BASE
export const RESET_PASSWORD = BASE_URL + "/reset-password";
export const FORGOT_PASSWORD = BASE_URL + "/forgot-password";
export const CLIENT_CURRENT = BASE_URL + "/current";
export const CLIENT_LOGIN = BASE_URL + "/log-in";

//ADMIN
export const ADMIN_URL = BASE_URL + "/admin";
export const ADMIN_LOGIN = ADMIN_URL + "/log-in";
export const ADMIN_CURRENT = ADMIN_URL + "/current";

//EMULATOR
export const EMULATOR_URL = BASE_URL + "/emulator";
export const EMULATOR_CREATE_RANDOM_URL = EMULATOR_URL + "/createRandom";
export const EMULATOR_CHANGE_SSID_URL = EMULATOR_URL + "/changeSsid";
export const EMULATOR_DELETE_URL = EMULATOR_URL;
export const EMULATOR_TELEPHONE_UPDATE_URL = EMULATOR_URL + "/updatePhoneNumber";
export const EMULATOR_ALT_TELEPHONE_UPDATE_URL = EMULATOR_URL + "/updateAlternatePhoneNumber";
export const EMULATOR_DRAG_URL = EMULATOR_URL + "/dragEmulator";
export const EMULATOR_NOTE_URL = EMULATOR_URL + "/note";

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
export const TRIP_STOPS_DELETE_URL = TRIP_STOPS_URL + "/delete";
export const TRIP_STOPS_UPDATE_WAIT_TIME_URL = TRIP_STOPS_URL + "/updateWaitTime";

export const TRIP_TOGGLE = TRIP_URL + "/toggle";
export const TRIP_HISTORY = TRIP_URL + "/history";

//Message

export const MESSAGE_URL = BASE_URL + "/message";
export const MESSAGE_SEND_MSG = MESSAGE_URL + "/send";

//Call
export const CALL_URL = BASE_URL + "/call";
export const CALL_MAKE_CALL = CALL_URL + "/make-call";


//twilio
export const PHONE_URL = BASE_URL + "/phone";
export const PHONE_GET_AVAILABLE_NUMBERS_URL = PHONE_URL + "/getAvailableNumbers";

//voice
export const VOICE_URL = BASE_URL + "/voice";
export const VOICE_GET_TOKEN_URL = VOICE_URL + "/token";

//notification
export const EMULATOR_SEND_URL = BASE_URL + "/send";
export const EMULATOR_NOTIFICATION_URL = EMULATOR_SEND_URL + "/notification";

