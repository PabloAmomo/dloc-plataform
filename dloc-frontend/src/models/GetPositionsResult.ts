import { DeviceLocation } from "./DeviceLocation";

export type GetPositionsResult = { locations: DeviceLocation[]; error: Error | null };
