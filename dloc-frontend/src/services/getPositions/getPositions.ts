import { GetPositionsResult } from "models/GetPositionsResult";
import axiosCommon from 'utils/axiosCommon';

const path  = "devices";
type typeParams = { interval: number, imei: string };

function getPositions(parameters: typeParams, callback: ((response: GetPositionsResult) => any), signal?: AbortController) {
  axiosCommon({
    type: "GET",
    path: '/' + path,
    defValue: [],
    parameters,
    signal,
    onEnd: (response: any) => {
      callback && callback({ locations: response?.data, error: response?.error });
    }
  });
}
export default getPositions;
