import { createVuetify } from "vuetify";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import { useAppLocaleStore } from "@/stores/appLocale";
import { storeToRefs } from "pinia";

export default {
  install: (app) => {
    const localeStore = useAppLocaleStore();
    const { appLocale } = storeToRefs(localeStore);

    const messages = {
      ar: {
        // Removes translation key warning. // TODO: switch to vuetify nuxt module or find an efficient way to import locale from i18n
        open: "فتح",
        close: "إغلاق",
        noDataText: "لا يوجد بيانات للعرض",
        "pagination.ariaLabel.root": "pagination.ariaLabel.root",
        "pagination.ariaLabel.previous": "pagination.ariaLabel.previous",
        "pagination.ariaLabel.next": "pagination.ariaLabel.next",
        "pagination.ariaLabel.page": "pagination.ariaLabel.page",
        "pagination.ariaLabel.currentPage": "pagination.ariaLabel.currentPage",
        input: {
          appendAction: "appendAction",
        },
        dataIterator: {
          rowsPerPageText: "العناصر لكل صفحة:",
          pageText: "{0}-{1} من {2}",
          loadingText: "جاري التحميل...",
        },
      },
    };

    const vuetify = createVuetify({
      components,
      directives,
      locale: {
        locale: appLocale.value || localStorage.getItem("app-locale"), // This is the line that actually makes a difference in document direction
        fallback: "en",
        messages,
      },
      theme: {
        defaultTheme: "myTheme",
        themes: {
          myTheme: {
            dark: false,
            colors: {
              secondary: `#212cff`,
              "secondary-light": "#F8D2EB",
              "secondary-lighter": "#212cff19",
              primary: `#de1d9d`,
              "primary-light": "#212cff33",
              "primary-lighter": "#FBE8F5",
              "custom-grey-lighter": "#f7f8f9",
              "custom-grey-light": "#dadada",
              "custom-grey-dark": `#f7f8f9`,
              error: "#d02c47",
              "error-light": "#fae1e4",
              success: "#4bae4f",
              "success-light": "#f7f8f9",
            },
          },
        },
      },
      defaults: {
        global: {
          rtl: false,
        },
      },
    });

    app.use(vuetify);
  },
};
