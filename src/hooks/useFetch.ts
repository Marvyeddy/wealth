import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);

    try {
      const res = await cb(...args);
      setData(res);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("An unknown error occurred"));
        toast.error(
          typeof error === "object" && error !== null && "message" in error
            ? (error as any).message
            : "An unknown error occurred"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    fn,
    setData,
  };
};

export default useFetch;
