import { useQuery } from "@tanstack/react-query";

import useAxios from "../../hooks/useAxios";
import bookKeys from "./cacheKeys";

const useGetBook = (isbn) => {
  const axiosClient = useAxios();

  const cacheKey = bookKeys.detail(isbn);

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/v1/books/${isbn}`),
  });

  return { ...query, data: query.data?.data.payload };
};

export default useGetBook;
