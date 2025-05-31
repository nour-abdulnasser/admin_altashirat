import { ref } from "vue";
import { defineStore } from "pinia";

import { useApi } from "@/composables/useApi";


export const useCountriesStore = defineStore("countries", () => {
  const userCountries = ref([]);

  const fetchAllCountries = async () => {
    try {
      const { _get } = useApi();
      const response = await _get("/countries", { pagination: "all" });
      if (response?.data?.data) {
        userCountries.value = response.data.data;

        return userCountries.value;
      }
    } catch (error) {
      throw error;
    }
  };

  return {
    userCountries,
    fetchAllCountries,
  };
});
