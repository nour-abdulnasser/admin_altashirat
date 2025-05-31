import axios from "axios";
import { storeToRefs } from "pinia";

import { useApiErrorStore } from "@/stores/apiError.js";
import { useAppLocaleStore } from "@/stores/appLocale.js";
import { useAuthStore } from "@/stores/auth.js";
import { useNotificationStore } from "@/stores/notification.js";

// API axios instance. I set the default URL to be the given apiUrl
export default () => {
  const apiErrorStore = useApiErrorStore();
  const env = import.meta.env;

  const instance = axios.create({
    baseURL: env.VITE_BASE_URL,
  });

  // NTS: I will add header in each request because the axios configuration does not get updated even when an authCookie is created.
  instance.interceptors.request.use(
    (config) => {
      const localeStore = useAppLocaleStore();
      const { appLocale } = storeToRefs(localeStore);
      if (!config.headers["x-locale"]) {
        config.headers["x-locale"] = appLocale.value;
      }
      // Try with store
      const authStore = useAuthStore();
      const { getAuthToken } = authStore;
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  instance.interceptors.response.use(
    (res) => {
      apiErrorStore.clearErrors();
      if (res?.data?.message) {
        const notificationStore = useNotificationStore();
        notificationStore.setNotification({
          type: "success", // Adjust vuetify theme
          text: res.data.message,
        });
      }
      return res;
    },
    (err) => {
      const { status, response } = err;

      if (status === 409 || status === 422) {
        apiErrorStore.setStatus(status);
        apiErrorStore.setErrors(response.data);
        const notificationStore = useNotificationStore();
        notificationStore.setNotification({
          type: "error",
          text: response.data.message,
        });
      }

      return Promise.reject(err);
    }
  );

  return instance;
};
