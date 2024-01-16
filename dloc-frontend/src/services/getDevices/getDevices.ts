import { GetDevicesResult } from 'models/GetDevicesResult';
import { MutableRefObject } from 'react';
import axiosCommon from 'utils/axiosCommon';

const path = 'devices';
type typeParams = {};

function getDevices(parameters: typeParams, callback: (response: GetDevicesResult) => any, abortAxios: MutableRefObject<AbortController | undefined>) {
  axiosCommon({
    type: 'GET',
    path: '/' + path,
    defValue: [],
    parameters,
    abortAxios,
    onEnd: (response: any) => callback && callback({ devices: response?.data, error: response?.error }),
  });
}
export default getDevices;
