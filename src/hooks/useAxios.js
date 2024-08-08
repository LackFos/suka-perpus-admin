import axios from "axios";

const useAxios = () => {
  const BASE_URL = `${import.meta.env.VITE_API_ENDPOINT}/api`;
  const token = localStorage.getItem("access_token");

  const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {},
  });

  const _get = (url, config = {}) => {
    const response = axiosClient.get(url, { ...config, headers: { Authorization: `Bearer ${token}` } });

    response.catch((error) => {
      if (error.response.status === 401) localStorage.removeItem("access_token");
    });

    return response;
  };

  const _post = (url, data = {}, config = {}) => {
    return axiosClient.post(url, data, { headers: { ...config.headers, Authorization: `Bearer ${token}` } });
  };

  const _put = (url, data = {}, config = {}) => {
    return axiosClient.put(url, data, config);
  };

  const _delete = (url, config = {}) => {
    return axiosClient.delete(url, { headers: { ...config.headers, Authorization: `Bearer ${token}` } });
  };

  return { _get, _post, _put, _delete };
};

export default useAxios;
