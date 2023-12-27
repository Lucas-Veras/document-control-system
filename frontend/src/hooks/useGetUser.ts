import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { IUser } from "../interfaces/IUser";
import AuthServices from "../services/AuthServices";
import useApiStatus from "./useApiStatus";

const useGetUser = ({
  setUser,
}: {
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
}) => {
  const { isLoading, setIsLoading } = useApiStatus({ isLoading: true });

  useEffect(() => {
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

    getUser();
  }, [setIsLoading, setUser]);

  return { isLoading };
};

export default useGetUser;
