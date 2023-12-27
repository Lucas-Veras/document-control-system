import React, { useState } from "react";
import useApiStatus from "../../hooks/useApiStatus";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import PdfServices from "../../services/PdfServices";
import { toast } from "react-toastify";

const ValidatePdf = () => {
  const [pdf, setPdf] = useState<Blob>();
  const { isLoading, setIsLoading } = useApiStatus();

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
        console.log(res);
        setIsLoading(false);
      })
      .catch(() => {
        toast.error("Erro ao validar documento, tente novamente mais tarde.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="flex flex-col items-start">
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
  );
};

export default ValidatePdf;
