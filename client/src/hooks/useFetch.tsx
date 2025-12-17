import { AxiosError, type AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";
import api from "../lib/api";

function useFetch<T>(url: string, options?: AxiosRequestConfig<unknown>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get(url, options);
        setData(response.data);
      } catch (err: AxiosError | Error | unknown) {
        if (err instanceof AxiosError) {
          setError(err.response?.data?.error || err.message);
        } else if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options]);

  return { data, setData, loading, error };
}

export default useFetch;
