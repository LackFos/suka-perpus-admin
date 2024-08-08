import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAxios from "../../hooks/useAxios";
import useLoadingToast from "../../hooks/useLoadingToast";

import bookKeys from "./cacheKeys";

const useCreateBook = () => {
  const axiosClient = useAxios();
  const queryClient = useQueryClient();

  const toast = useLoadingToast();

  const mutation = useMutation({
    mutationFn: ({ data }) => {
      toast.loading("Menambahkan buku...");
      return axiosClient._post(`/v1/books`, data, { headers: { "Content-Type": "multipart/form-data" } });
    },

    onSuccess: () => {
      toast.update("Buku ditambah", "success");
      queryClient.invalidateQueries({ queryKey: ["stats"] });
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

export default useCreateBook;
