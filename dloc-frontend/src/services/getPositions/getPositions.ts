import { GetPositionsResult } from 'models/GetPositionsResult';
import { MutableRefObject } from 'react';
import axiosCommon from 'utils/axiosCommon';

const path = 'devices';
type typeParams = { interval: number; imei: string };

function getPositions(parameters: typeParams, callback: (response: GetPositionsResult) => any, abortAxios: MutableRefObject<AbortController | undefined>) {
  axiosCommon({
    type: 'GET',
    path: '/' + path,
    defValue: [],
    parameters,
    abortAxios,
    onEnd: (response: any) => callback && callback({ locations: response?.data, error: response?.error }),
  });
}

export default getPositions;
