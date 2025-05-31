import { ref } from "vue";
import API from "@/plugins/axios/config";
``
export const useApi = () => {
  const isLoading = ref(false);

  const toggleLoadingFlag = () => (isLoading.value = !isLoading.value);
  const _get = async (endpoint, params = {}, customHeaders = {}) => {
    toggleLoadingFlag();
    try {
      const response = await API().get(endpoint, {
        params: params,
        headers: customHeaders
      });
      return response;
    } catch (err) {
      throw err;
    } finally {
      toggleLoadingFlag();
    }
  };
  const _post = async (endpoint, data) => {
    toggleLoadingFlag();
    try {
      const response = await API().post(endpoint, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response;
    } catch (err) {
      throw err;
    } finally {
      toggleLoadingFlag();
    }
  };

  const _delete = async (endpoint) => {
    toggleLoadingFlag();
    try {
      const response = await API().delete(endpoint);
      return response;
    } catch (err) {
      throw err;
    } finally {
      toggleLoadingFlag();
    }
  };

  return {
    isLoading,
    _get,
    _post,
    _delete,
  };
};