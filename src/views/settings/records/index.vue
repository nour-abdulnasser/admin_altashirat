<template>
  <div>
    <v-card class="card mx-3" :title="t('settings.list_settings')">

      <div class="pa-4">
       
        <MyTable
          url="/admin-panel/settings"
          :loading="isLoading"
          :headers="headers"
          ref="settingsTable"
          :bus-key="busKey"

        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-start">
              <Edit @click="handleEdit(item)" />
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
const settingsTable = ref(null);
const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const headers = [
  { title: t("settings.fields.key"), key: "key", sortable: false },
  { title: t("settings.fields.actions"), key: "actions", sortable: false },
];
const busKey = "settings-table";

const handleEdit = (item) => {
  // Remove the query parameters, just like in titles component
  router.push(`/settings/${item.id}/edit`);
};

const refreshData = () => {
  isRefreshing.value = true;
  settingsTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};

onMounted(() => {
  eventBus.on("settings-table:refresh", refreshData);
});

onBeforeUnmount(() => {
  eventBus.off("settings-table:refresh", refreshData);
});
</script>

<style lang="scss" scoped>
</style>