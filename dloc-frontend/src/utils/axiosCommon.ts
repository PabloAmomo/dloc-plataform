import axios from "axios";
import { config } from 'config/config';

function axiosCommon({ type, path, defValue, parameters, onEnd, signal }: { type: "GET" | "POST", path: string, defValue: object, parameters?: any, onEnd: any, signal?: AbortController}) {

  // Ej. de parameters: { val1: value1 } (Si es un GET se envia en query string y si es un POST va como body)
  switch (type) {
    case "GET":
      axios
        .get(`${config.server}${path}`, { params: parameters ? parameters  : undefined, signal: signal?.signal  }  )
        .then(response => onEnd(response?.data ?? defValue))
        .catch((error: Error) => { onEnd({ error: error.message }) });
      break;

    case "POST":
      axios
        .post(`${config.server}${path}`, { params:  parameters ? parameters  : undefined, signal })
        .then(response => onEnd(response?.data ?? defValue))
        .catch((error: Error) => { onEnd({ error: error.message }) });
      break;

    default:
  }
}
export default axiosCommon;
