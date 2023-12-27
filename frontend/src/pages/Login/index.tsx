import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Link } from "react-router-dom";
import LogoPDF from "../../assets/svgs/pdf.svg";
import FormControl from "../../components/FormControl";
import Input from "../../components/Input";
import useLogin from "../../hooks/useLogin";

const Login = () => {
  const { register, isLoading, handleSubmit, handleLogin, errors } = useLogin();

  return (
    <main className="max-w-[25rem] mx-auto">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Link to={"/"}>
            <img
              className="mx-auto h-20 w-auto cursor-pointer"
              src={LogoPDF}
              alt="SecureSign"
              title="SecureSign"
            />
          </Link>
          <h2 className="mt-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Entre na sua conta
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
            <FormControl
              label="Username"
              htmlFor="username"
              isError={!!errors.username}
              errorMessage={errors.username?.message}
            >
              <Input
                id="username"
                autoComplete="username"
                isError={!!errors.username}
                {...register("username")}
              />
            </FormControl>

            <FormControl
              label="Senha"
              htmlFor="password"
              isError={!!errors.password}
              errorMessage={errors.password?.message}
            >
              <Input
                id="password"
                autoComplete="current-password"
                type="password"
                isError={!!errors.password}
                {...register("password")}
              />
            </FormControl>

            {errors.root?.serverError?.message && (
              <p className="text-red-500 text-sm text-center">
                {errors.root.serverError?.message}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary/95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/50"
              >
                {isLoading ? (
                  <div className="animate-spin py-[5px]">
                    <AiOutlineLoading3Quarters />
                  </div>
                ) : (
                  <p>Cadastrar-se</p>
                )}
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Não possui conta?{" "}
            <Link
              to={"/register"}
              className="font-semibold leading-6 text-primary hover:text-primary/95"
            >
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Login;
