import React, { createContext, useState } from "react";
import useGetUser from "../hooks/useGetUser";
import { IUser } from "../interfaces/IUser";

interface IUserContext {
  user?: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  isLoading: boolean;
}

const UserContext = createContext<IUserContext>(null!);

export const UserProvider = ({
  children,
}: {
  children: React.ReactNode[] | React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser | undefined>();
  const { isLoading } = useGetUser({ setUser });

  return (
    <UserContext.Provider
      value={{ user: user ?? undefined, setUser, isLoading }}
    >
      {isLoading ? <>carregando...</> : children}
    </UserContext.Provider>
  );
};

export default UserContext;
