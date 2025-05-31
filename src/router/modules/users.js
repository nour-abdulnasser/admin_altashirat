export const userRoutes = {
  path: "/users",
  component: () => import("@/views/user/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
  },
  children: [
    {
      path: "",
      name: "records",
      component: () => import("@/views/user/records/index.vue"),
      meta: {
        heading: {
          key: true,
          title: "drawer.users",
        },
        breadcrumb: "pages.users",
      },
    },
  ],
};
