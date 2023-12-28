import React, { useState } from "react";
import useApiStatus from "../../hooks/useApiStatus";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PdfServices from "../../services/PdfServices";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import FormControl from "../../components/FormControl";
import { yupResolver } from "@hookform/resolvers/yup";
import { pdfSchema } from "./schemas/pdfSchema";
import { useForm } from "react-hook-form";

const ValidatePdf = () => {
  const [pdf, setPdf] = useState<Blob>();
  const { isLoading, setIsLoading } = useApiStatus();
  const { isLoading: isLoadingHash, setIsLoading: setIsLoadingHash } =
    useApiStatus();
  const {
    register,
    handleSubmit: handleFormSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver<{ hash: string }>(pdfSchema),
    mode: "onChange",
  });

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPdf(e.target.files[0]);
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!pdf) {
      toast.error("Selecione um arquivo para verificar sua autenticidade.");
      return;
    }

    setIsLoading(true);
    const file = new FormData();
    file.append("file", pdf);

    PdfServices.validatePdf(file)
      .then((res) => {
        if (res.data.valid && res.data.intact) {
          toast.success("O documento é autêntico e não foi modificado");
        } else if (res.data.valid) {
          toast.success("O documento é autêntico");
        } else if (res.data.intact) {
          toast.error("O documento foi não modificado");
        } else {
          toast.error("O documento não é autêntico");
        }

        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Erro ao validar documento, tente novamente mais tarde.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitHash = (data: { hash: string }) => {
    setIsLoadingHash(true);
    PdfServices.validateByHash(data.hash)
      .then(() => {
        toast.success("O hash é válido");
        reset();
        setIsLoadingHash(false);
      })
      .catch((err) => {
        if (err.response.data.errors[0]?.message === "Not found.") {
          toast.error("Hash inválido");
          setError("hash", {
            type: "manual",
            message: "Hash inválido",
          });
        } else {
          toast.error("Erro ao validar documento, tente novamente mais tarde.");
        }
      })
      .finally(() => {
        setIsLoadingHash(false);
      });
  };

  return (
    <div>
      <form className="flex flex-col items-start mb-5">
        <h3 className="text-lg font-bold">Verificar arquivo</h3>
        <input
          type="file"
          className="my-5"
          onChange={handleUploadFile}
          accept="application/pdf"
        />
        <button
          type="submit"
          className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium  hover:bg-headerHover/90 hover:text-white"
          onClick={(e) => handleSubmit(e)}
        >
          {isLoading ? (
            <div className="animate-spin py-[5px]">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            <>Verificar</>
          )}
        </button>
      </form>

      <form
        className="flex flex-col items-start"
        onSubmit={handleFormSubmit(handleSubmitHash)}
      >
        <h3 className="text-lg font-bold">Verificar hash do arquivo</h3>
        <FormControl
          label="Hash"
          htmlFor="hash"
          isError={!!errors.hash}
          errorMessage={errors.hash?.message}
        >
          <Input id="hash" isError={!!errors.hash} {...register("hash")} />
        </FormControl>
        <button className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium  hover:bg-headerHover/90 hover:text-white">
          {isLoadingHash ? (
            <div className="animate-spin py-[5px]">
              <AiOutlineLoading3Quarters />
            </div>
          ) : (
            <>Verificar</>
          )}
        </button>
      </form>
    </div>
  );
};

export default ValidatePdf;
