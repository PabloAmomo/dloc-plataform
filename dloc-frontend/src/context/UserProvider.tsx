import { createContext, useContext, useState } from 'react';
import { User } from 'models/User';
import { UserProviderInterface } from 'models/UserProviderInterface';
import getEmptyUser from 'functions/getEmptyUser';

const UserContext = createContext<UserProviderInterface>({
  close: () => {},
  validate: () => {},
  setUser: () => {},
  getUser: () => getEmptyUser(),
  getEmptyUser: () => getEmptyUser(),
  user: getEmptyUser(),
});

export function UserProvider({ children }: { children: any }) {
  const [user, setUser] = useState<User>(getEmptyUser());

  return (
    <UserContext.Provider
      value={{
        close: () => setUser(getEmptyUser()),
        validate: () => setUser((prev) => ({ ...prev, validated: true })),
        setUser: (user: User) => setUser((prev) => ({ ...prev, ...user })),
        getUser: () => user,
        getEmptyUser: () => getEmptyUser(),
        user,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
