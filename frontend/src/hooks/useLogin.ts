import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ILogin } from "../interfaces/ILogin";
import { GenericErrorType } from "../interfaces/IResponse";
import { loginSchema } from "../pages/Login/schemas/login";
import AuthServices from "../services/AuthServices";
import useApiStatus from "./useApiStatus";

const useLogin = () => {
  const { isLoading, setIsLoading } = useApiStatus();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<ILogin>(loginSchema),
    mode: "onChange",
  });
  console.log(errors);

  const handleLogin = async (data: ILogin) => {
    setIsLoading(true);

    AuthServices.login(data)
      .then(() => {
        reset();
        navigate("/login");
        toast.success("Login realizado com sucesso!");
      })
      .catch((error) => {
        console.log(error.response.data);
        toast.error("Erro ao criar conta!");
        error.response.data.errors.forEach(
          (error: GenericErrorType<keyof ILogin>) => {
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
    handleLogin,
  };
};

export default useLogin;
