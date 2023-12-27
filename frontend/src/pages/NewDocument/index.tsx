import React from "react";
import Input from "../../components/Input";
import FormControl from "../../components/FormControl";
import { yupResolver } from "@hookform/resolvers/yup";
import { documentSchema } from "./schemas/documentSchema";
import { useForm } from "react-hook-form";
import DocumentServices from "../../services/DocumentServices";
import { toast } from "react-toastify";
import useApiStatus from "../../hooks/useApiStatus";
import { useNavigate } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface IDocument {
  name: string;
  description: string;
}

const NewDocument = () => {
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<IDocument>(documentSchema),
    mode: "onChange",
  });
  const { setIsLoading, isLoading } = useApiStatus();

  const navigate = useNavigate();

  const handleCreateDocument = async (data: IDocument) => {
    setIsLoading(true);
    DocumentServices.createDocument(data)
      .then(() => {
        toast.success("Documento criado com sucesso");
        setIsLoading(false);
        reset();
        navigate("/dashboard");
      })
      .catch(() => {
        toast.error("Erro ao criar documento");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(handleCreateDocument)}>
      <FormControl
        label="Nome do documento"
        htmlFor="name"
        isError={!!errors.name}
        errorMessage={errors.name?.message}
      >
        <Input id="name" isError={!!errors.name} {...register("name")} />
      </FormControl>
      <FormControl
        label="Descrição do documento"
        htmlFor="description"
        isError={!!errors.description}
        errorMessage={errors.description?.message}
      >
        <textarea
          className={` ${
            !!errors.description && "!ring-red-500 !focus:ring-indigo-500"
          } outline-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6 px-2 h-28`}
          {...register("description")}
        />
      </FormControl>

      <button className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium  hover:bg-headerHover/90 hover:text-white">
        {isLoading ? (
          <div className="animate-spin py-[5px]">
            <AiOutlineLoading3Quarters />
          </div>
        ) : (
          <>Criar</>
        )}
      </button>
    </form>
  );
};

export default NewDocument;
