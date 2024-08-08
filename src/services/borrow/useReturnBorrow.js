import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAxios from "../../hooks/useAxios";
import useLoadingToast from "../../hooks/useLoadingToast";

import borrowKeys from "./cacheKeys";
import bookKeys from "../book/cacheKeys";

const useReturnBorrow = () => {
  const axiosClient = useAxios();
  const queryClient = useQueryClient();

  const toast = useLoadingToast();

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      toast.loading("Mengembalikan buku...");
      return axiosClient._post(`/v1/borrows/${id}/return`);
    },

    onSuccess: () => {
      toast.update("Buku dikembalikan", "success");
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: borrowKeys.lists });
      queryClient.invalidateQueries({ queryKey: bookKeys.lists });
    },

    onError: () => {
      toast.update("Terjadi kesalahan, silahkan coba lagi", "error");
    },
  });

  return {
    ...mutation,
    statusCode: mutation.isSuccess ? mutation.data?.status : mutation.isError ? mutation.error?.response?.status : undefined,
    data: { ...mutation.data?.data },
    error: { ...mutation.error?.response.data.errors },
  };
};

export default useReturnBorrow;
