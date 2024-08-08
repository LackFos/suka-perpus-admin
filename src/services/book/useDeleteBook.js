import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAxios from "../../hooks/useAxios";
import useLoadingToast from "../../hooks/useLoadingToast";

import bookKeys from "./cacheKeys";

const useDeleteBook = () => {
  const axiosClient = useAxios();
  const queryClient = useQueryClient();

  const toast = useLoadingToast();

  const mutation = useMutation({
    mutationFn: ({ id }) => {
      toast.loading("Menghapus buku...");
      return axiosClient._delete(`/v1/books/${id}`);
    },

    onSuccess: (_, variables) => {
      toast.update("Buku dihapus", "success");
      queryClient.invalidateQueries({ queryKey: ["stats"] });
      queryClient.invalidateQueries({ queryKey: bookKeys.lists });
      queryClient.invalidateQueries({ queryKey: variables.cacheKey });
    },

    onError: () => {
      toast.update("Terjadi kesalahan, silahkan coba lagi", "error");
    },
  });

  return {
    ...mutation,
    statusCode: mutation.isSuccess ? mutation.data?.status : mutation.isError ? mutation.error?.response?.status : undefined,
    data: { ...mutation.data?.data },
    error: { ...mutation.error },
  };
};

export default useDeleteBook;
