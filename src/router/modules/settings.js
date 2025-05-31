export const settingsRoutes = {
  path: "/settings",
  component: () => import("@/views/settings/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
  },
  children: [
    {
      path: "",
      name: "settings-table",
      component: () => import("@/views/settings/records/index.vue"),
      meta: {
        heading: {
          key: true,
          title: "drawer.settings",
        },
        breadcrumb: "pages.settings",
      },
    },
   
    {
      path: ":id/edit",
      name: "settings-edit",
      component: () => import("@/views/settings/actions/index.vue"),
      props: false,
      meta: {
        heading: {
          key: false,
          title: "common.edit",
        },
      },
    },
  ],
};
