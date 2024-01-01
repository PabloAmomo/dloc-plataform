import { Persistence } from "../../models/Persistence";
import { Response } from "../../models/Response";
import { PersistenceResult } from "../../models/PersistenceResult";

const getPositions = async (imei: string, interval: number, persistence: Persistence) : Promise<Response> => { 
  const response: PersistenceResult = await persistence.getPositions(imei, interval);

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response.results, message: 'ok' } };
};

export { getPositions };
