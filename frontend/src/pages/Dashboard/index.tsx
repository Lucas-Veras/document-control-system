import { useState } from "react";
import { toast } from "react-toastify";
import PrivateTemplate from "../../Templates/Private";
import DocumentCard from "../../components/DocumentCard";
import Pagination from "../../components/Pagination";
import useApiStatus from "../../hooks/useApiStatus";
import useGetMyDocuments from "../../hooks/useGetMyDocuments";
import PdfServices from "../../services/PdfServices";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { documents, isLoading, metadata, hasError } = useGetMyDocuments({
    page: currentPage,
  });
  const { isLoading: isLoadingPdf, setIsLoading: setIsLoadingPdf } =
    useApiStatus();
  const { isLoading: isLoadingSignedPdf, setIsLoading: setIsLoadingSignedPdf } =
    useApiStatus();

  const onPrevClick = () => {
    if (metadata!.current_page === 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const onNextClick = () => {
    if (metadata!.current_page === metadata?.pages) return;
    setCurrentPage((prev) => prev + 1);
  };

  const handleDownloadPdf = (id: number, name: string) => {
    setIsLoadingPdf(true);
    PdfServices.pdfGenerate(id)
      .then((res) => {
        const blobUrl = window.URL.createObjectURL(
          new Blob([res], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode!.removeChild(link);
        toast.success("PDF gerado com sucesso");
      })
      .catch(() => {
        toast.error("Houve um erro ao gerar o PDF");
      })
      .finally(() => {
        setIsLoadingPdf(false);
      });
  };

  const handleDownloadSignedPdf = (id: number, name: string) => {
    setIsLoadingSignedPdf(true);
    PdfServices.signedPdfGenerate(id)
      .then((res) => {
        const blobUrl = window.URL.createObjectURL(
          new Blob([res], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = blobUrl;
        link.setAttribute("download", `${name}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode!.removeChild(link);
        toast.success("PDF gerado com sucesso");
      })
      .catch(() => {
        toast.error("Houve um erro ao gerar o PDF");
      })
      .finally(() => {
        setIsLoadingSignedPdf(false);
      });
  };

  return (
    <PrivateTemplate name="Meus documentos">
      {isLoading ? (
        <h1>Carregando...</h1>
      ) : (
        <>
          {hasError ? (
            <h1 className="text-center">
              Houve um erro ao carregar seus documentos, tente novamente mais
              tarde
            </h1>
          ) : (
            <div className="flex flex-col px-4 lg:px-0">
              <div className="mb-2 flex justify-between">
                <h4>{metadata?.all_count} resultados</h4>
              </div>
              {documents?.map((item) => (
                <DocumentCard
                  key={item.id}
                  name={item.name}
                  description={item.description}
                  handleDownloadPdf={handleDownloadPdf}
                  handleDownloadSignedPdf={handleDownloadSignedPdf}
                  isLoading={isLoadingPdf}
                  isLoadingSignedPdf={isLoadingSignedPdf}
                  id={item.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {!hasError && (
        <Pagination
          currentPage={currentPage}
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          totalpages={metadata?.pages}
        />
      )}
    </PrivateTemplate>
  );
};

export default Dashboard;
