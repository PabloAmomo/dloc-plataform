import { Persistence } from "../../models/Persistence";
import { Response } from "../../models/Response";
import { PersistenceResult } from "../../models/PersistenceResult";

const persistenceHealth = async (persistence: Persistence) : Promise<Response> => { 
  const response: PersistenceResult = await persistence.health();

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response.results[0], message: 'ok' } };
};

export { persistenceHealth };
