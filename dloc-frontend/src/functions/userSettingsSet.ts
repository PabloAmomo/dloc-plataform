import { UserSettings } from "models/UserSettings";

const userSettingsSet = (settings: UserSettings) => {
  localStorage.setItem("userSettings", JSON.stringify(settings));
}

export default  userSettingsSet;