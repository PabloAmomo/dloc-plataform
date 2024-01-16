import axios from 'axios';
import { config } from 'config/config';
import { MutableRefObject } from 'react';

interface AxiosCommon {
  type: 'GET' | 'POST';
  path: string;
  defValue: object;
  parameters?: any;
  onEnd: any;
  abortAxios: MutableRefObject<AbortController | undefined>;
}

function axiosCommon({ type, path, defValue, parameters, onEnd, abortAxios }: AxiosCommon) {
  if (abortAxios.current) abortAxios.current.abort();
  abortAxios.current = new AbortController();
  const signal: AbortController = abortAxios.current;

  // Ej. de parameters: { val1: value1 } (Si es un GET se envia en query string y si es un POST va como body)
  switch (type) {
    case 'GET':
      axios
        .get(`${config.server}${path}`, { params: parameters ? parameters : undefined, signal: signal?.signal })
        .then((response) => {
          abortAxios.current = undefined;
          onEnd(response?.data ?? defValue);
        })
        .catch((error: Error) => {
          abortAxios.current = undefined;
          onEnd({ error: error.message });
        });
      break;

    case 'POST':
      axios
        .post(`${config.server}${path}`, { params: parameters ? parameters : undefined, signal })
        .then((response) => {
          abortAxios.current = undefined;
          onEnd(response?.data ?? defValue);
        })
        .catch((error: Error) => {
          abortAxios.current = undefined;
          onEnd({ error: error.message });
        });
      break;

    default:
  }
}
export default axiosCommon;
