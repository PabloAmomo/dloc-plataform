import { GetUserResult } from "models/GetUserResult";
import { IconType } from "models/IconType";
import { User } from "models/User";

type typeParams    = { };

function getUser(parameters: typeParams, callback: ((response: GetUserResult) => any), signal?: AbortController) {
  const user : User = {
    id: 0,
    userName: 'name',
    name: '',
    middle: 'middle',
    last: 'last',
    email: 'email@mail.com',
    validated: true,
    devices: {},
    iconOnMap: IconType.pulse,
    iconLocation: IconType.point,
  };
  callback && callback({ user, error: null });
}
export default getUser;
