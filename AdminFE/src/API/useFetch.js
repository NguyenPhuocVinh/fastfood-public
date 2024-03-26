import { useState, useEffect } from "react";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu từ server");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Cleanup function to cancel fetch request if component unmounts before fetch completes
    return () => {
      // Your cleanup code here, if needed
    };
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
