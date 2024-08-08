import { useMutation } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useLoadingToast from "../../hooks/useLoadingToast";

const useLogin = () => {
  const axiosClient = useAxios();

  const toast = useLoadingToast();

  return useMutation({
    mutationFn: (credentials) => {
      toast.loading("Mencoba login");
      return axiosClient._post("/v1/users/login", credentials);
    },
    onSuccess: ({ data }) => {
      toast.update(data.message, "success");
    },
    onError: (error) => {
      toast.update(error.response.data.message, "error");
    },
  });
};

export default useLogin;
