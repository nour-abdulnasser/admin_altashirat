<template>
  <div>
    <v-card class="card mx-3" :title="t('titles.list_title')">
      <div class="pa-4">
        <MyTable
          url="/admin-panel/titles"
          :loading="isLoading"
          :headers="headers"
          ref="titlesTable"
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
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-start">
              <Edit class="me-2" @click="handleEdit(item)" />
              <Destroy
                refresh-event-key="titles-table:refresh"
                class="me-2"
                :id="item.id"
                url="/admin-panel/titles"
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
const titlesTable = ref(null);
const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const busKey = "titles-table";

const headers = [
  { title: t("titles.fields.name"), key: "name", sortable: false },
  { title: t("titles.fields.visible"), key: "visible", sortable: false },

  { title: t("titles.fields.actions"), key: "actions", sortable: false },
];
const isTrue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string")
    return value === "1" || value.toLowerCase() === "true";
  return !!value;
};
const handleEdit = (item) => {
  router.push(`/titles/${item.id}/edit`);
};
const navigateToCreate = (item) => {
  router.push(`/titles/add`);
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
    await _post(`/admin-panel/titles/${item.id}`, formData);
    item.visible = visibility; // Only update the table after response is successful
    eventBus.emit("titles-table:refresh");
  } catch (err) {
    throw err;
  } finally {
    isRefreshing.value = false;
  }
};
const refreshData = () => {
  isRefreshing.value = true;
  titlesTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};
onMounted(() => {
  eventBus.on("titles-table:refresh", refreshData);
});
onBeforeUnmount(() => {
  eventBus.off("titles-table:refresh", refreshData);
});
</script>

<style lang="scss" scoped>
</style>