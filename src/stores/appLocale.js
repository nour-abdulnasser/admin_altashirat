import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useAppLocaleStore = defineStore("locale-store", () => {
  // Initialize locale from localStorage or default to 'en'
  const appLocale = ref(localStorage.getItem("app-locale") || "en");

  // Watch for changes to locale and update localStorage
  watch(appLocale, (newLocale) => {
    localStorage.setItem("app-locale", newLocale);
  });

  function setAppLocale(newLocale) {
    appLocale.value = newLocale;
  }

  return {
    appLocale,
    setAppLocale,
  };
});
