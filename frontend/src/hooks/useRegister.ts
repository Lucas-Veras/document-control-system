import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IRegister } from "../interfaces/IRegister";
import { GenericErrorType } from "../interfaces/IResponse";
import { registerSchema } from "../pages/Register/schemas/register";
import AuthServices from "../services/AuthServices";
import useApiStatus from "./useApiStatus";

const useRegister = () => {
  const { isLoading, setIsLoading } = useApiStatus();
  const navigate = useNavigate();
  const {
    register,
    setError,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<IRegister>(registerSchema),
    mode: "onChange",
  });

  const handleRegister = async (data: IRegister) => {
    setIsLoading(true);
    AuthServices.register(data)
      .then(() => {
        reset();
        navigate("/login");
        toast.success("Conta criada com sucesso!");
      })
      .catch((error) => {
        toast.error("Erro ao criar conta!");
        error.response.data.errors.forEach(
          (error: GenericErrorType<keyof IRegister>) => {
            setError(`${error.location}`, {
              type: error.type,
              message: error.message,
            });
          }
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    handleRegister,
  };
};

export default useRegister;
