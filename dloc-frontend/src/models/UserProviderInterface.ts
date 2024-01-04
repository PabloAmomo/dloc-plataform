import { User } from "./User";

export interface UserProviderInterface {
  setUser: {
    (userData: User): void;
  };
  getUser: {
    (): User;
  };
  getEmptyUser: {
    (): User;
  };
  validate: {
    (): void;
  };
  close: {
    (): void;
  };
  user: User;
}