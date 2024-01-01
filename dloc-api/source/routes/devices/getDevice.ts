import { Persistence } from '../../models/Persistence';
import { PersistenceResult } from '../../models/PersistenceResult';
import { Response } from '../../models/Response';

const getDevice = async (imei: string, persistence: Persistence): Promise<Response> => {
  const response: PersistenceResult = await persistence.getDevice(imei);

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response?.results?.[0] ?? {}, message: 'ok' } };
};

export { getDevice };
