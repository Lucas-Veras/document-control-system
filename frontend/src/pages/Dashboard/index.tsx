import { useState } from "react";
import { Link } from "react-router-dom";
import PrivateTemplate from "../../Templates/Private";
import DocumentCard from "../../components/DocumentCard";
import Pagination from "../../components/Pagination";
import useGetMyDocuments from "../../hooks/useGetMyDocuments";

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { documents, isLoading, metadata, hasError } = useGetMyDocuments({
    page: currentPage,
  });

  const onPrevClick = () => {
    if (metadata!.current_page === 1) return;
    setCurrentPage((prev) => prev - 1);
  };

  const onNextClick = () => {
    if (metadata!.current_page === metadata?.pages) return;
    setCurrentPage((prev) => prev + 1);
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
                  id={item.id}
                />
              ))}
            </div>
          )}
        </>
      )}

      {metadata && metadata?.all_count === 0 && (
        <div className="flex justify-center items-center h-[20vh]">
          <Link
            to={"/newdocument"}
            className="bg-primary text-white rounded-md px-3 py-2 text-sm font-medium  hover:bg-headerHover/90 hover:text-white"
          >
            Criar documento
          </Link>
        </div>
      )}

      {!hasError && metadata && metadata?.pages > 1 && (
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
