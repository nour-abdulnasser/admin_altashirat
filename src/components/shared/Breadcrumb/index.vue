<template>
  <div class="d-flex justify-start align-center me-7">
    <div
      v-bind="$attrs"
      :class="[$attrs.class, { 'w-100': !showCreateButton }]"
      class="breadcrumb__nav d-flex justify-start align-center rounded-e-lg"
    >
      <v-breadcrumbs
        :items="breadcrumbItems"
        class="pa-0 ps-3 d-flex justify-start align-center h-100"
      >
      </v-breadcrumbs>
    </div>
    <Button
      v-if="showCreateButton"
      :text="t('buttons.create')"
      class="elevation-0 ms-2 breadcrumb__button button--primary-filled"
      @click="navigateToCreate"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

import { asyncRoutes } from "@/router/asyncRoutes";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();

const matched = computed(() => route.matched); // For reactivitty


// Generate breadcrumb items based on route meta
const breadcrumbItems = computed(() => {
  const items = [];

  // matched.value contains only the route objects that match the current URL path
  // For /titles/add it would typically include the /titles route and the /titles/add route
  // It doesn't include all children, only the ones in the current path

  // Parent route
  if (matched.value.length > 0) {
    const parentRoute = matched.value[0];
    if (parentRoute.meta?.breadcrumb) {
      items.push({
        title: t(parentRoute.meta.breadcrumb),
        href: parentRoute.path,
      });
    }
  }

  // Has children
  if (matched.value.length > 1) {
    const childRoute = matched.value[1];
    if (childRoute.meta?.breadcrumb) {
      items.push({
        title: t(childRoute.meta.breadcrumb),
        href: route.path,
      });
    } 
  }


  return items;
});

const showCreateButton = computed(() => {
  // Look through the asyncRoutes. If has no children, no create.

  // Check if we're on a matched route
  if (!matched.value.length) return false;

  const parentRoute = matched.value[0]; // To get the first bit after the title
  const asyncRoute = asyncRoutes.find((r) => r.path === parentRoute.path);

  // Hide create button if we are on an add route
  if (route.path.endsWith("/add")) {
    return false;
  }



  // Check for "add" child to show create button
  return asyncRoute?.children?.some((child) => child.path === "add");
});

const navigateToCreate = () => {
  const basePath = matched.value[0].path;
  router.push(`${basePath}/add`);
};
</script>