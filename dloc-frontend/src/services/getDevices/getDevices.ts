import { GetDevicesResult } from 'models/GetDevicesResult';
import { MutableRefObject } from 'react';
import axiosCommon from 'utils/axiosCommon';

const path = 'devices';
type typeParams = {};

function getDevices(parameters: typeParams, callback: (response: GetDevicesResult) => any, abortAxios: MutableRefObject<AbortController | undefined>) {
  if (abortAxios.current) abortAxios.current.abort();
  abortAxios.current = new AbortController();
  const signal : AbortController = abortAxios.current;

  axiosCommon({
    type: 'GET',
    path: '/' + path,
    defValue: [],
    parameters,
    signal,
    onEnd: (response: any) => {
      abortAxios.current = undefined;
      callback && callback({ devices: response?.data, error: response?.error });
    },
  });
}
export default getDevices;
