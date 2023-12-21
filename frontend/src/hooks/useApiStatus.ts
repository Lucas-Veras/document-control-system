import { useState } from "react";

const useApiStatus = ({ isLoading: isLoadingProp = false } = {}) => {
  const [isLoading, setIsLoading] = useState(isLoadingProp);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryFetch, setRetryFetch] = useState(false);

  return {
    isLoading,
    isSuccess,
    hasError,
    retryFetch,
    setIsLoading,
    setIsSuccess,
    setHasError,
    setRetryFetch,
  };
};

export default useApiStatus;
