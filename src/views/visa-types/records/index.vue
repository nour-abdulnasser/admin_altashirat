<template>
  <div>
    <v-card class="card mx-3" :title="t('visas.list_title')">
      <div class="pa-4">
        <MyTable
          url="/admin-panel/visa-types"
          :loading="isLoading"
          :headers="headers"
          ref="visasTable"
          :bus-key="busKey"
        >
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
          <!-- eslint-disable-next-line vue/valid-v-slot -->

          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-start">
              <Edit @click="handleEdit(item)" class="me-3" />
              <Destroy
                refresh-event-key="visas-table:refresh"
                :id="item.id"
                url="/admin-panel/visa-types"
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
import { useRouter } from "vue-router";
import { onMounted, onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";

import { useApi } from "@/composables/useApi.js";
import eventBus from "@/utils/eventBus.js";

import { useAppLocaleStore } from "@/stores/appLocale";

const router = useRouter();
const { _post, isLoading } = useApi();
const { t } = useI18n();

const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const isRefreshing = ref(false);
const visasTable = ref(null);
const busKey = "visas-table";

const headers = [
  { title: t("visas.fields.name"), key: "name", sortable: false },
  { title: t("visas.fields.visible"), key: "visible", sortable: false },
  { title: t("visas.fields.actions"), key: "actions", sortable: false },
];
const isTrue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string")
    return value === "1" || value.toLowerCase() === "true";
  return !!value;
};
const handleEdit = (item) => {
  router.push(`/visa-types/${item.id}/edit`);
};
const navigateToCreate = (item) => {
  router.push(`/visa-types/add`);
};

const handleToggle = async (item) => {
  isRefreshing.value = true;
  const locale = appLocale.value || "en";

  const currentVisibility = item.visible;
  const newVisibility = !currentVisibility;
  const visibility = newVisibility ? 1 : 0;

  const formData = new FormData();

  formData.append("visible", visibility);
  formData.append("locale", locale);
  formData.append("_method", "put");
  try {
    await _post(`/admin-panel/visa-types/${item.id}`, formData);
    item.visible = visibility; // Only update the table after response is successful
    eventBus.emit("visas-table:refresh");
  } catch (err) {
    throw err;
  } finally {
    isRefreshing.value = false;
  }
};
const refreshData = () => {
  isRefreshing.value = true;
  visasTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};

onMounted(() => {
  eventBus.on("visas-table:refresh", refreshData);
});
onBeforeUnmount(() => {
  eventBus.off("visas-table:refresh", refreshData);
});
</script>

<style lang="scss" scoped>
</style>