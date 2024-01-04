import { config } from "config/config";
import { UserSettings } from "models/UserSettings";

const getEmptyUserSettings  =  () : UserSettings  => { 
  return { geoMap: { interval: config.defaultInterval, showDevices: [ "0" ]}  } 
}

export default  getEmptyUserSettings;