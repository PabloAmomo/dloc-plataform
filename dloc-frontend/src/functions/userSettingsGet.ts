import { UserSettings } from "models/UserSettings";
import getEmptyUserSettings from "./getEmptyUserSettings";

const userSettingsGet = () : UserSettings => {
  return JSON.parse(localStorage.getItem("userSettings") ?? JSON.stringify(getEmptyUserSettings()));
}
export default  userSettingsGet;