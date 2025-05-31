// TODO: Find a way to localize title
export const tourismVisasRoutes = {
  path: "/tourism-visas",
  component: () => import("@/views/tourism-visas/index.vue"),
  meta: {
    layout: "DefaultLayout", // TODO: Create a layout for this in layouts
  },
  children: [
    {
      path: "",
      name: "tourism-visas-table",
      component: () => import("@/views/tourism-visas/records/index.vue"),
      meta: {
        heading: {
          key: true,
          title: "drawer.tourismVisas",
        },
        breadcrumb: "pages.tourismVisas",
      },
    },

    {
      path: ":id/edit",
      name: "tourism-visas-edit",
      component: () => import("@/views/tourism-visas/actions/index.vue"),
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
