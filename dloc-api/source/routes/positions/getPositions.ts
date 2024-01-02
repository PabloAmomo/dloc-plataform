import { Persistence } from "../../models/Persistence";
import { Response } from "../../models/Response";
import { GetPositionsResult } from "../../persistence/models/GetPositionsResult";

const getPositions = async (imei: string, interval: number, persistence: Persistence) : Promise<Response> => { 
  const response: GetPositionsResult = await persistence.getPositions(imei, interval);

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response.results, message: 'ok' } };
};

export { getPositions };
