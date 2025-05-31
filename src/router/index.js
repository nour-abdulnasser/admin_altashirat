import { createRouter, createWebHistory } from "vue-router";
import { asyncRoutes } from "./asyncRoutes";
import { useAuthStore } from "@/stores/auth";
const defaultRoutes = [
  {
    path: "/",
    name: "login",
    meta: {
      layout: "DefaultLayout", // TODO: Create a layout for this in layouts
    },
    component: () => import("@/views/auth/login/index.vue"),
  },
];

const notFoundRoute = {
  // This will match any path that isn't defined in other routes
  path: "/:pathMatch(.*)*",
  name: "NotFound",
  component: () => import("@/views/errors/404/index.vue"), 
  meta: {
    layout: "ErrorLayout",
    title: "Page Not Found",
    requiresAuth: false,
  },
};

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...defaultRoutes, ...asyncRoutes, notFoundRoute],
});


// Track if we're already attempting auth initialization
let authInitialized = false;
let authInitializing = false;

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem("auth-token");
  const authStore = useAuthStore();
  const publicRoutes = ["/"]; // Only the login page is public

  // Check if the route is the NotFound route - allow access to it
  const isNotFoundRoute = to.name === "NotFound";

  // Initialize auth state if we have a token but haven't initialized yet
  if (token && !authInitialized && !authInitializing) {
    authInitializing = true;
    try {
      await authStore.initAuth();
      authInitialized = true;
    } catch (error) {
      // If auth init fails, clear token and redirect to login
      localStorage.removeItem("auth-token");
      authInitializing = false;
      return next("/");
    }
    authInitializing = false;
  }

  // If user has token and trying to access login page, redirect to users
  if (token && publicRoutes.includes(to.path)) {
    return next("/users");
  }

  // If user has no token and trying to access a protected route, redirect to login
  // But always allow access to the NotFound route
  if (!token && !publicRoutes.includes(to.path) && !isNotFoundRoute) {
    return next("/");
  }

  // Otherwise, proceed with navigation as normal
  return next();
});

export default router;
