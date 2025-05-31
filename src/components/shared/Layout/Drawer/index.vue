<template>
  <div>
    <v-navigation-drawer
      :permanent="!mobile"
      :temporary="mobile"
      :model-value="drawerState"
      :class="[{ closed: !drawerState }]"
      @update:model-value="handleDrawerUpdate"
      class="h-screen drawer border-md rounded-ts-xl mt-3 ms-3"
    >
      <v-list-item class="d-flex justify-center my-1">
        <div
          class="navbar__profile d-flex flex-column justify-center align-center"
        >
          <v-avatar color="surface-variant" size="80">
            <Image name="logo" class="w-100 h-100" />
          </v-avatar>
        </div>
      </v-list-item>

      <!-- Navigation items -->
      <v-list-item
        v-for="item in navigationItems"
        :key="item.path"
        :class="isActive(item.path) ? 'drawer__item--active' : 'drawer__item'"
        link
        class="mb-3"
        @click="navigateTo(item.path)"
      >
        <div class="d-flex align-center">
          <v-icon
            class="me-3 my-1 pa-4 position-relative dashboard-icon__wrapper"
          >
            <Image icon="dashboard" class="position-absolute dashboard-icon" />
          </v-icon>
          <div class="drawer__item__text">
            <p>
              {{ item.title }}
            </p>
          </div>
        </div>
      </v-list-item>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useDrawerStore } from "@/stores/drawer.js";
import { computed, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { asyncRoutes } from "@/router/asyncRoutes";
import { useAuthStore } from "@/stores/auth";

const { t } = useI18n();
const { md, mobile } = useDisplay();
const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const { userProfile } = storeToRefs(authStore);

const drawerStore = useDrawerStore();
const { toggleDrawer } = drawerStore;
const { drawerState } = storeToRefs(drawerStore);

// Extract navigation items from asyncRoutes
const navigationItems = computed(() => {
  const items = [];
  // Loop through each module route
  asyncRoutes.forEach((moduleRoute) => {
    // Check if the module has children
    if (moduleRoute.children && moduleRoute.children.length) {
      // Find the index route (usually the empty path "")
      const indexRoute = moduleRoute.children.find(
        (route) => route.path === "" && route.meta?.heading?.key === true
      );
      if (indexRoute) {
        items.push({
          title: t(indexRoute.meta.heading.title),
          path: moduleRoute.path,
          name: indexRoute.name,
        });
      }
    }
  });
  return items;
});

// Check if the current route is active
const isActive = (path) => {
  return route.path.startsWith(path);
};

// Linking the drawer state stylistically to the store in xs mode
const handleDrawerUpdate = () => {
  toggleDrawer();
};

// Navigation function
const navigateTo = (path) => {
  router.push(path);
};

onMounted(() => {
  if (mobile.value) {
    drawerState.value = false; // default value in mobile mode
  }
});


</script>