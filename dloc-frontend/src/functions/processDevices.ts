import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { Location } from 'models/Location';

/** Update devices */
const processDevices = (response: GetPositionsResult, devices:Device[]) : Device[] => {
  var newDevices: Device[] = [...devices];
  response.locations.forEach((location: Location) => {
    for (let i = 0; i < newDevices.length; i++) {
      if (newDevices[i].imei === location.imei) {
        const { batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC } = location;
        const update = Date.now();
        Object.assign(newDevices[i], { update, batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC });
        break;
      }
    }
  });
  /** Set new devices */
  return newDevices;
};

export default processDevices;