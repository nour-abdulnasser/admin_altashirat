<template>
  <div>
    <v-card class="card mx-3" :title="t('countries.list_countries')">
      <div class="pa-4">
        <MyTable
          url="/admin-panel/countries"
          :loading="isLoading"
          :headers="headers"
          ref="countriesTable"
          :bus-key="busKey"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.flag="{ item }">
            <span class="emoji-container">
              {{ item.flag }}
            </span>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.phone_code="{ item }">
            <span dir="ltr">

              {{ formatPhoneCode(item.phone_code) }}
            </span>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.visible="{ item }">
            <v-chip
              @click="handleToggle(item)"
              :color="isTrue(item.visible) ? 'success' : 'error'"
              size="small"
            >
              {{
                isTrue(item.visible) ? t("common.visible") : t("common.hidden")
              }}
            </v-chip>
          </template>
        </MyTable>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useApi } from "@/composables/useApi.js";
import { useRoute } from "vue-router";
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import { storeToRefs } from "pinia";

import eventBus from "@/utils/eventBus.js";

import { useDrawerStore } from "@/stores/drawer";

import { useAppLocaleStore } from "@/stores/appLocale";

const { _post, isLoading } = useApi();
const route = useRoute();
const { t } = useI18n();

const isRefreshing = ref(false);
const countriesTable = ref(null);

const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const drawerStore = useDrawerStore();
const { drawerState } = storeToRefs(drawerStore);

const busKey = "countries-table";

// Compute whether the current route has breadcrumb information
const hasBreadcrumb = computed(() => {
  return route.meta && route.meta.breadcrumb;
});

const headers = [
  { title: t("countries.fields.name"), key: "name", sortable: false },
  { title: t("countries.fields.flag"), key: "flag", sortable: false },
  { title: t("countries.fields.currency"), key: "currency", sortable: false },
  {
    title: t("countries.fields.phone_code"),
    key: "phone_code",
    sortable: false,
  },
  { title: t("countries.fields.visible"), key: "visible", sortable: false },
];
const isTrue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string")
    return value === "1" || value.toLowerCase() === "true";
  return !!value;
};

const formatPhoneCode = (phoneCode) => {
  if (!phoneCode) return "";
  return phoneCode.startsWith("00") 
    ? "+" + phoneCode.substring(2) 
    : phoneCode;
};

const handleToggle = async (item) => {
  isRefreshing.value = true;
  const locale = appLocale.value || "en"; // TODO: use store

  const currentVisibility = item.visible;
  const newVisibility = !currentVisibility;
  const visibility = newVisibility ? 1 : 0;

  const formData = new FormData();

  formData.append("name", item.name);
  formData.append("visible", visibility);
  formData.append("locale", locale);
  formData.append("_method", "put");
  try {
    await _post(`/admin-panel/countries/${item.id}`, formData);
    item.visible = visibility; // Only update the table after response is successful
    eventBus.emit("countries-table:refresh");
  } catch (err) {
    throw err;
  } finally {
    isRefreshing.value = false;
  }
};
const refreshData = () => {
  isRefreshing.value = true;
  countriesTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};
onMounted(() => {
  eventBus.on("countries-table:refresh", refreshData);
});
onBeforeUnmount(() => {
  eventBus.off("countries-table:refresh", refreshData);
});
</script>

<style lang="scss" scoped></style>