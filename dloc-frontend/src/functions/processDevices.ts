import { Device } from 'models/Device';
import { GetPositionsResult } from 'models/GetPositionsResult';
import { DeviceLocation } from 'models/DeviceLocation';

/** Update devices */
const processDevices = (response: GetPositionsResult, devices:Device[]) : Device[] => {
  var newDevices: Device[] = [...devices];
  response.locations.forEach((location: DeviceLocation) => {
    for (let i = 0; i < newDevices.length; i++) {
      if (newDevices[i].imei === location.imei) {
        const { batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC, locations } = location;
        Object.assign(newDevices[i], { update: Date.now(), batteryLevel, directionAngle, gsmSignal, lat, lng, speed, lastPositionUTC, lastVisibilityUTC, locations });
        if (location.imei === '869207032620461') {
          console.log('processDevices', newDevices[i].lastPositionUTC, newDevices[i].lat, newDevices[i].lng);
        }
        break;
      }
    }
  });
  /** Set new devices */
  return newDevices;
};

export default processDevices;