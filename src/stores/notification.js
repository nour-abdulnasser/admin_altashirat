import { defineStore } from "pinia";
import { ref } from "vue";

export const useNotificationStore = defineStore("notification-store", () => {
  const isShown = ref(null);
  const notification = ref(null);

  const showNotification = () => {
    isShown.value = true;
  };
  const setNotification = ({ type, text }) => {
    showNotification();
    notification.value = { type, text };
    setTimeout(() => {
      clearNotification();
    }, 3000);
  };

  const clearNotification = () => {
    isShown.value = false;
    notification.value = null;
  };

  return {
    isShown,
    notification,
    showNotification,
    setNotification,
    clearNotification,
  };
});
