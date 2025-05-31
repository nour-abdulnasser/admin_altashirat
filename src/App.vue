<template>
  <v-app>
    <div
      class="app-container d-flex flex-column position-relative overflow-hidden"
    >
      <!-- Error Layout -->
      <template v-if="isErrorLayout">
        <v-main class="error-layout">
          <v-container>
            <RouterView />
          </v-container>
        </v-main>
      </template>

      <!-- Default Layout -->
      <template v-else-if="isDefaultLayout">
        <div class="w-100 d-flex justify-center">
          <Notification class="notification" v-if="isShown && notification" />
        </div>
        <Drawer v-if="isAuth" />
        <Header class="border-s-0 mt-3 mx-3 ps-sm-6" />
        <v-main class="overflow-auto main-content">
          <div
            class=""
            :class="[
              { 'v-container v-container--fluid py-0 ms-3': !drawerState },
            ]"
          >
            <Breadcrumb
              v-if="hasBreadcrumb"
              :class="[{ 'border-s-0': drawerState }]"
            />
          </div>
          <v-container fluid>
            <RouterView />
          </v-container>
        </v-main>
      </template>
    </div>
  </v-app>
</template>

<script setup>
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { RouterView, useRoute } from "vue-router";

import { useAuthStore } from "./stores/auth";
import { useDrawerStore } from "./stores/drawer";
import { useNotificationStore } from "./stores/notification";

const authStore = useAuthStore();
const { isAuth } = storeToRefs(authStore);
const route = useRoute();

const notificationStore = useNotificationStore();
const { isShown, notification } = storeToRefs(notificationStore);

const drawerStore = useDrawerStore();
const { drawerState } = storeToRefs(drawerStore);

// Compute whether the current route has breadcrumb information
const hasBreadcrumb = computed(() => {
  return route.meta && route.meta.breadcrumb;
});

// Determine layout
const isErrorLayout = computed(() => {
  return route.meta.layout === "ErrorLayout";
});
const isDefaultLayout = computed(() => {
  return route.meta.layout === "DefaultLayout";
});
</script>

<style lang="scss">
body {
  font-family: "Tajawal", sans-serif;
  background-color: #f7f8f9;
}
</style>