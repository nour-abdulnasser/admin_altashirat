import { ref } from "vue";
import { defineStore } from "pinia";

export const useFormLocaleStore = defineStore("form-locale", () => {

  const defaultLocale =
  localStorage.getItem("app-locale") ||
  localStorage.getItem("form-locale") ||
    "en"; // default depends on app locale..

  const formLocale = ref(defaultLocale);

  const setFormLocale = (newLocale) => {
    formLocale.value = newLocale;
    localStorage.setItem("form-locale", formLocale.value);
  };

  return {
    formLocale,
    setFormLocale,
   
  };
});
