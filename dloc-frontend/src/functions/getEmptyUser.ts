import { IconType } from "models/IconType";

const getEmptyUser = () => ({
  id: 0,
  userName: '',
  name: '',
  middle: '',
  last: '',
  email: '',
  validated: false,
  devices: {},
  iconOnMap: IconType.pulse,
  iconLocation: IconType.point,
});

export default getEmptyUser;