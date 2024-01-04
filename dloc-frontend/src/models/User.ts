import { IconType } from './IconType';

export type User = {
  validated: boolean;
  id: number,
  userName: string,
  name: string,
  middle: string,
  last: string,
  email: string,
  iconOnMap: IconType,
  iconLocation: IconType,
  devices: any;
};

