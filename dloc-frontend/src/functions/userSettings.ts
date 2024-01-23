import { UserSettings } from "models/UserSettings";
import getEmptyUserSettings from "./getEmptyUserSettings";

const userSettingsGet = () : UserSettings => {
  return JSON.parse(localStorage.getItem("userSettings") ?? JSON.stringify(getEmptyUserSettings()));
}
const userSettingsSet = (settings: UserSettings) => {
  localStorage.setItem("userSettings", JSON.stringify(settings));
}

export { userSettingsSet, userSettingsGet};
