import { createI18n } from "vue-i18n";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("app-locale") || "en", // TODO: from store
  fallbackLocale: "en",
  missingWarn: false,
  fallbackWarn: false,
  silentTranslationWarn: true,
  silentFallbackWarn: true,

  messages: {
    en,
    ar,
  },
});

export default i18n;
