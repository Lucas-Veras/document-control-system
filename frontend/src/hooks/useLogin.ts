import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ILogin } from "../interfaces/ILogin";
import { GenericErrorType } from "../interfaces/IResponse";
import { loginSchema } from "../pages/Login/schemas/login";
import AuthServices from "../services/AuthServices";
import useApiStatus from "./useApiStatus";
import { jwtDecode } from "jwt-decode";
import useAuth from "./useAuth";

const useLogin = () => {
  const { setAuthTokens, setUser } = useAuth();
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

  const handleLogin = async (data: ILogin) => {
    setIsLoading(true);

    AuthServices.login(data)
      .then((res) => {
        setAuthTokens(res);
        setUser(jwtDecode(res.access));
        localStorage.setItem("authTokens", JSON.stringify(res));
        reset();
        navigate("/dashboard");
        toast.success("Login realizado com sucesso!");
      })
      .catch((error) => {
        toast.error("Erro ao criar conta!");
        error.response.data.errors.forEach(
          (error: GenericErrorType<keyof ILogin>) => {
            if (error.type === "system")
              setError("root.serverError", {
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
