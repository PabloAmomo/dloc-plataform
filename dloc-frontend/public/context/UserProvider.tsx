import { createContext, useContext, useState } from "react";
import { typeUser, emptyUser } from "models/typeUser";

const UserContext = createContext<userProviderInterface | null>(null);

interface userProviderInterface {
  updateUser: CallableFunction;
  getUser: CallableFunction;
  validateUser: CallableFunction;
  closeSession: CallableFunction;
}

export const useUserContext = () => useContext(UserContext);

export function UserProvider({children}:{children: any}) {
  const [userDetails, setUserDetails] = useState<TypeUser>({ ...emptyUser });

  const returnUserProvider: userProviderInterface | undefined = {
    closeSession: () => setUserDetails({ ...emptyUser }),
    validateUser: (userData:typeUser) => setUserDetails({ ...userData, validated: true, devices: [ ...(userData.devices) ] }), 
    updateUser: (userData:typeUser) => setUserDetails(userData),
    getUser: () => userDetails,
  };

  return (
    <UserContext.Provider value={returnUserProvider}>
        {children}
    </UserContext.Provider>
  );
}
