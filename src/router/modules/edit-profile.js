export const profileRoutes = {
  path: "/profile",
  name: "profile",
  component: () => import("@/views/edit-profile/index.vue"),
  meta: { requiresAuth: true, layout: "DefaultLayout" },
};
