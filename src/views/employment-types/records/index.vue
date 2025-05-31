<template>
  <div>
    <v-card class="card mx-3" :title="t('employment-types.list_title')">
      <div class="pa-4">
    <MyTable
      url="/admin-panel/employment-types"
      :loading="isLoading"
      :headers="headers"
      ref="employmentTable"
      :bus-key="busKey"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.visible="{ item }">
        <v-chip
          @click="handleToggle(item)"
          :color="isTrue(item.visible) ? 'success' : 'error'"
          size="small"
        >
          {{ isTrue(item.visible) ? t("common.visible") : t("common.hidden") }}
        </v-chip>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.actions="{ item }">
        <div class="d-flex gap-2 justify-start">
          <Edit @click="handleEdit(item)" class="me-3"  />
          <Destroy
            refresh-event-key="employment-types-table:refresh"
            :id="item.id"
            url="/admin-panel/employment-types"
          />
        </div>
      </template>
    </MyTable>
    
  </div>
</v-card>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useApi } from "@/composables/useApi.js";
import { useRouter } from "vue-router";
import { onMounted, onBeforeUnmount, ref } from "vue";
import eventBus from "@/utils/eventBus.js";
import { useAppLocaleStore } from "@/stores/appLocale";
import { storeToRefs } from "pinia";
const router = useRouter();
const { _post, isLoading } = useApi();
const { t } = useI18n();
const isRefreshing = ref(false);
const employmentTable = ref(null);
const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const busKey = "employment-types-table";
// In the records,
// 1. We pass url and headers to the table.
// 2. We use custom templates to customize out table. E.g.: for actions
// How to get headers?
const headers = [
  { title: t("employment-types.fields.name"), key: "name", sortable: false },
  {
    title: t("employment-types.fields.visible"),
    key: "visible",
    sortable: false,
  },
  {
    title: t("employment-types.fields.actions"),
    key: "actions",
    sortable: false,
  },
];
const isTrue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string")
    return value === "1" || value.toLowerCase() === "true";
  return !!value;
};
const handleEdit = (item) => {
  router.push(`/employment-types/${item.id}/edit`);
};
const navigateToCreate = (item) => {
  router.push(`/employment-types/add`);
};

const handleToggle = async (item) => {
  isRefreshing.value = true;
  const locale = appLocale.value || "en"; // TODO: use store

  const currentVisibility = item.visible;
  const newVisibility = !currentVisibility;
  const visibility = newVisibility ? 1 : 0;

  const formData = new FormData();

  //formData.append("name", item.name);
  formData.append("visible", visibility);
  formData.append("locale", locale);
  formData.append("_method", "put");
  try {
    await _post(`/admin-panel/employment-types/${item.id}`, formData);
    item.visible = visibility; // Only update the table after response is successful
    // TODO: Connect with event bus to reload table after toggle request
    eventBus.emit("employment-types-table:refresh");
  } catch (err) {
    console.error(err)
    throw err;
  } finally {
    isRefreshing.value = false;
  }
};
const refreshData = () => {
  isRefreshing.value = true;
  employmentTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};

onMounted(() => {
  eventBus.on("employment-types-table:refresh", refreshData);
});
onBeforeUnmount(() => {
  eventBus.off("employment-types-table:refresh", refreshData);
});
</script>

<style lang="scss" scoped>
</style>