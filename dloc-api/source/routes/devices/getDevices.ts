import { Persistence } from "../../models/Persistence";
import { Response } from "../../models/Response";
import { GetDevicesResult } from "../../persistence/models/GetDevicesResult";

const getDevices = async (persistence: Persistence) : Promise<Response> => { 
  const response: GetDevicesResult = await persistence.getDevices();

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response.results, message: 'ok' } };
};

export { getDevices };
