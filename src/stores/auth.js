import { defineStore } from "pinia";
import { ref, computed } from "vue";

import { useApi } from "@/composables/useApi";

export const useAuthStore = defineStore("auth-store", () => {
  const userProfile = ref(null);
  const userRoles = ref(null); // Will be an array of roles
  const isAuth = computed(() => !!userProfile.value);

  function getAuthToken() {
    return localStorage.getItem("auth-token");
  }

  function setAuthToken(token) {
    if (token) {
      localStorage.setItem("auth-token", token);
    } else {
      localStorage.removeItem("auth-token");
    }
  }

  const fetchUserProfile = async () => {
    try {
      const { _get } = useApi();

      const response = await _get("/show-account", { pagination: "all" });
      if (response?.data?.user) {
        userProfile.value = response.data.user;
      }

      return response.data.user;
    } catch (error) {
      throw error;
    }
  };

  const fetchUserRoles = async () => {
    try {
      const { _get } = useApi();
      const fullUser = await _get(`/admin-panel/users/${userProfile.value.id}`);

      if (fullUser?.data?.user) {
        userRoles.value = fullUser.data.user.roles;
        return fullUser.data.user.roles;
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  const initAuth = async () => {
    if (getAuthToken()) {
      await fetchUserProfile();
      await fetchUserRoles();
      if (!isAuth.value) {
        // Remove token if user is unauthenticated, to prevent manual token input in local storage causing bug.
        setAuthToken();
      }
    }
  };

  return {
    userProfile,
    userRoles,
    isAuth,
    fetchUserProfile,
    getAuthToken,
    setAuthToken,
    initAuth,
  };
});
