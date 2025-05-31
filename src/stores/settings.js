import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useApi } from "@/composables/useApi.js";

export const useSettingsStore = defineStore("settings-store", () => {
  const settingsApi = ref({}); // Will contain apiResponse

  // Turning into key-value pairs
  const settings = computed(() => {
    if (!settingsApi.value.data || !settingsApi.value.data.length) {
      return {};
    }
    return settingsApi.value.data.reduce((acc, current) => {
      acc[current.key] = current.value;
      return acc;
    }, {});
  });

  // Call the API to fill in store.settings
  const getSettingsApi = async () => {
    try {
      const response = await useApi()._get("settings");
      settingsApi.value = response.data;
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    settings,
    settingsApi,
    getSettingsApi,
  };
});
