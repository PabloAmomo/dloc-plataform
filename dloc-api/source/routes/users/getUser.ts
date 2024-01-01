import { Persistence } from "../../models/Persistence";
import { PersistenceResult } from "../../models/PersistenceResult";
import { Response } from "../../models/Response";

const getUser = async (id: number, persistence: Persistence) : Promise<Response> => { 
  const response: PersistenceResult = await persistence.getUser(id);

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response.results, message: 'ok' } };
};

export { getUser };
