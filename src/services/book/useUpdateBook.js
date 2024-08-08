import { useMutation, useQueryClient } from "@tanstack/react-query";

import useAxios from "../../hooks/useAxios";
import useLoadingToast from "../../hooks/useLoadingToast";

import bookKeys from "./cacheKeys";

const useUpdateBook = () => {
  const axiosClient = useAxios();
  const queryClient = useQueryClient();

  const toast = useLoadingToast();

  const mutation = useMutation({
    mutationFn: ({ id, data }) => {
      toast.loading("Mengupdate buku...");
      return axiosClient._post(`/v1/books/${id}`, { ...data, _method: "PUT" }, { headers: { "Content-Type": "multipart/form-data" } });
    },

    onSuccess: (_, variables) => {
      toast.update("Buku diupdate", "success");
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
    error: { ...mutation.error?.response.data.errors },
  };
};

export default useUpdateBook;
