import { useQuery } from "@tanstack/react-query";

import useAxios from "../../hooks/useAxios";

const useGetStats = () => {
  const axiosClient = useAxios();

  const cacheKey = ["stats"];

  const query = useQuery({
    queryKey: cacheKey,
    staleTime: Infinity,
    queryFn: () => axiosClient._get(`/v1/stats`),
  });

  return { ...query, data: query.data?.data.payload };
};

export default useGetStats;
