export const MY_CONSTANT_STRING = "Hello, World!";
export const LOCAL_API = "http://192.168.1.112:8080";
export const LIVE_API = "http://64.226.101.239:8080";
export const LIVE_API_CLIENT = "http://149.28.69.114:8080";

export const BASE_URL = LOCAL_API;

//BASE
export const RESET_PASSWORD = BASE_URL + "/reset-password";

//ADMIN
export const ADMIN_URL = BASE_URL + "/admin";
export const ADMIN_LOGIN = ADMIN_URL + "/log-in";
export const ADMIN_CURRENT = ADMIN_URL + "/current";

//EMULATOR
export const EMULATOR_URL = BASE_URL + "/emulator";

//USER
export const USER_URL = BASE_URL + "/user";
export const USER_CHANGE_STATUS_URL = USER_URL + "/change-status";


//USER ASSIGN EMULATOR
export const USER_ASSIGN_EMULATOR_URL = BASE_URL + "/user-assign-emulator";

//DOWNLOAD
export const DOWNLOAD_URL = BASE_URL + "/download";
export const DOWNLOAD_APK = DOWNLOAD_URL + "/apk";
