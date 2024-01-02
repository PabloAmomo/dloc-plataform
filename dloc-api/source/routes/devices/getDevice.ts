import { Persistence } from '../../models/Persistence';
import { Response } from '../../models/Response';
import { GetDeviceResult } from '../../persistence/models/GetDeviceResult';

const getDevice = async (imei: string, persistence: Persistence): Promise<Response> => {
  const response: GetDeviceResult = await persistence.getDevice(imei);

  if (response.error) return { code: 500, result: { data: [], message: response.error.message } };
  else return { code: 200, result: { data: response?.results?.[0] ?? {}, message: 'ok' } };
};

export { getDevice };
