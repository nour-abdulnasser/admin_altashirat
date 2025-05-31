export const countriesRoutes = {
  path: "/countries",
  component: () => import("@/views/countries/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
  },
  children: [
    {
      path: "",
      name: "countries-table",
      component: () => import("@/views/countries/records/index.vue"),
      meta: {
        heading: {
          key: true,
          title: "drawer.countries",
        },
        breadcrumb: "pages.countries",
      },
    },
  
  ],
};
