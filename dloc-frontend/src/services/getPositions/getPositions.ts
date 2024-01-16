import { GetPositionsResult } from "models/GetPositionsResult";
import { MutableRefObject } from "react";
import axiosCommon from 'utils/axiosCommon';

const path  = "devices";
type typeParams = { interval: number, imei: string };

function getPositions(parameters: typeParams, callback: ((response: GetPositionsResult) => any), abortAxios: MutableRefObject<AbortController | undefined>) {
  if (abortAxios.current) abortAxios.current.abort();
  abortAxios.current = new AbortController();
  const signal : AbortController = abortAxios.current;
  axiosCommon({
    type: "GET",
    path: '/' + path,
    defValue: [],
    parameters,
    signal,
    onEnd: (response: any) => {
      abortAxios.current = undefined;
      callback && callback({ locations: response?.data, error: response?.error });
    }
  });
}

export default getPositions;
