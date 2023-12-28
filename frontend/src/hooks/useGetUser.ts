import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { IUser } from "../interfaces/IUser";
import AuthServices from "../services/AuthServices";
import useApiStatus from "./useApiStatus";
import useAuth from "./useAuth";

const useGetUser = ({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const { isLoading, setIsLoading } = useApiStatus({ isLoading: true });
  const { authTokens } = useAuth();

  const getUser = async () => {
    if (!localStorage.getItem("authTokens")) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    AuthServices.getUser()
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        toast.error(
          "Houve um erro ao carregar o usuário, tente novamente mais tarde."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUser(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authTokens]);

  return { isLoading, getUser };
};

export default useGetUser;
