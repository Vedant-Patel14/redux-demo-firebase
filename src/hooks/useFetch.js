import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const useFetch = (endpoint) => { 
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/${endpoint}`);
        const products = response.data;
        setData(products);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, error };
};

export default useFetch;
