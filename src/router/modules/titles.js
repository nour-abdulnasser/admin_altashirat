export const titleRoutes = {
  path: "/titles",
  component: () => import("@/views/titles/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
    breadcrumb: "pages.titles",
  },
  children: [
    {
      path: "",
      name: "titles-table",
      component: () => import("@/views/titles/records/index.vue"),
      meta: {
        heading: {
          key: true,
          title: "drawer.titles",
        },
      },
    },
    {
      path: "add",
      name: "titles-create",
      component: () => import("@/views/titles/actions/index.vue"),
      meta: {
        heading: {
          key: false,
          title: "common.create",
        },
        breadcrumb: "common.create",
      },
    },
    {
      path: ":id/edit",
      name: "titles-edit",
      component: () => import("@/views/titles/actions/index.vue"),
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
