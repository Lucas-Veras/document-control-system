import { useEffect, useState } from "react";
import DocumentServices from "../services/DocumentServices";
import useApiStatus from "./useApiStatus";
import { useUser } from "./useUser";
import { IDocument } from "../interfaces/IDocument";
import { toast } from "react-toastify";
import { IMetadata } from "../interfaces/IResponse";

const useGetMyDocuments = ({ page }: { page: number }) => {
  const { isLoading: isLoadingUser, user } = useUser();
  const { isLoading, setIsLoading, setHasError, hasError } = useApiStatus({
    isLoading: true,
  });
  const [documents, setDocuments] = useState<IDocument[]>([]);
  const [metadata, setMetadata] = useState<IMetadata>();

  useEffect(() => {
    const getMyDocuments = () => {
      if (!user?.id) return;
      setIsLoading(true);

      DocumentServices.getMyDocuments({
        id: user.id,
        ordering: "-id",
        page: page,
        per_page: 7,
      })
        .then((res) => {
          setDocuments(res.data);
          setMetadata(res.metadata);
        })
        .catch(() => {
          setHasError(true);
          toast.error(
            "Houve um erro ao carregar seus documentos, tenta novamente mais tarde."
          );
        })
        .finally(() => {
          setIsLoading(false);
        });
    };
    if (!isLoadingUser) getMyDocuments();
  }, [user?.id, setIsLoading, isLoadingUser, setHasError, page]);

  return { isLoading, documents, hasError, metadata };
};

export default useGetMyDocuments;
