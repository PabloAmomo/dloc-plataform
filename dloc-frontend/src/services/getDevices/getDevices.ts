import { GetDevicesResult } from 'models/GetDevicesResult';
import axiosCommon from 'utils/axiosCommon';

const path = 'devices';
type typeParams = {};

function getDevices(parameters: typeParams, callback: (response: GetDevicesResult) => any, signal?: AbortController) {
  axiosCommon({
    type: 'GET',
    path: '/' + path,
    defValue: [],
    parameters,
    signal,
    onEnd: (response: any) => {
      callback && callback({ devices: response?.data, error: response?.error });
    },
  });
}
export default getDevices;
