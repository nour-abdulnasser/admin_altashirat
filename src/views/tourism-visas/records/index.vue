<template>
  <div>
    <v-card class="card mx-3" :title="t('tourismVisas.list_title')">
      <div class="pa-4">
        <MyTable
          url="/admin-panel/tourism-visa"
          :loading="isLoading"
          :headers="headers"
          ref="tourismTable"
          :bus-key="busKey"
        >
          <!-- Format provider name -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.provider="{ item }">
            <span>{{ item.user.firstname }} {{ item.user.lastname }}</span>
          </template>

          <!-- Format request date -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.requestDate="{ item }">
            <span>{{ formatDate(item.statuses[0].activated_at) }}</span>
          </template>

          <!-- Format phone -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.phone="{ item }">
            <span dir="ltr">
              {{ formatPhone(item.phone) }}
            </span>
          </template>

          <!-- Format email -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.contact_email="{ item }">
            <span class="text-truncate">{{ item.contact_email }}</span>
          </template>

          <!-- Format destination country -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.destination_country="{ item }">
            <v-chip size="small" class="text-truncate">
              <span class="emoji-container emoji-countries me-1">{{
                item.destination_country.flag
              }}</span>
              {{ item.destination_country.name }}
            </v-chip>
          </template>

          <!-- Format status (new column) -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.status="{ item }">
            <v-chip :color="getStatusColor(item.statuses)" size="small">
              {{ getActiveStatus(item.statuses) }}
            </v-chip>
          </template>

          <!-- Action buttons -->
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-start">
              <Edit class="me-2" @click="handleEdit(item)" />
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
import { useRouter, useRoute } from "vue-router";
import { onMounted, onBeforeUnmount, ref } from "vue";
import eventBus from "@/utils/eventBus.js";

import { useAppLocaleStore } from "@/stores/appLocale";
import { storeToRefs } from "pinia";
const router = useRouter();
const route = useRoute();
const { _post, isLoading } = useApi();
const { t } = useI18n();

const isRefreshing = ref(false);
const tourismTable = ref(null);

const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const busKey = "tourism-table";

const headers = [
  { title: t("tourismVisas.fields.id"), key: "id", sortable: false },
  {
    title: t("tourismVisas.fields.providerName"),
    key: "provider",
    sortable: false,
  },
  {
    title: t("tourismVisas.fields.requestDate"),
    key: "requestDate",
    sortable: false,
  },
  { title: t("tourismVisas.fields.phone"), key: "phone", sortable: false },
  {
    title: t("tourismVisas.fields.contact_email"),
    key: "contact_email",
    sortable: false,
  },
  {
    title: t("tourismVisas.fields.destination_country"),
    key: "destination_country",
    sortable: false,
  },
  { title: t("tourismVisas.fields.status"), key: "status", sortable: false },
  { title: t("tourismVisas.fields.actions"), key: "actions", sortable: false },
];

const formatPhone = (phone) => {
  if (!phone) return "";

  const formattedCountryCode = phone.country_code.startsWith("00")
    ? "+" + phone.country_code.slice(2)
    : phone.country_code;

  const fullPhoneNumber = `${formattedCountryCode} ${phone.number}`;

  return phone.extension
    ? `${fullPhoneNumber} ext. ${phone.extension}`
    : fullPhoneNumber;
};

const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const getActiveStatus = (statuses) => {
  if (!statuses || !statuses.length) return "";

  const activeStatuses = statuses
    .filter((status) => status.active && status.activated_at)
    .sort((a, b) => new Date(b.activated_at) - new Date(a.activated_at));

  return activeStatuses.length > 0 ? activeStatuses[0].name : statuses[0].name;
};

const getStatusColor = (statuses) => {
  if (!statuses || !statuses.length) return "grey";

  const activeStatuses = statuses
    .filter((status) => status.active && status.activated_at)
    .sort((a, b) => new Date(b.activated_at) - new Date(a.activated_at));

  return activeStatuses.length > 0
    ? activeStatuses[0].color
    : statuses[0].color;
};

const isTrue = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "string")
    return value === "1" || value.toLowerCase() === "true";
  return !!value;
};

const handleEdit = (item) => {
  const currentPage = parseInt(route.query.page) || 1;
  router.push({
    path: `/tourism-visas/${item.id}/edit`,
    query: { returnPage: currentPage }
  });
};

const refreshData = () => {
  isRefreshing.value = true;
  tourismTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};

onMounted(() => {
  eventBus.on("tourism-table:refresh", refreshData);
});

onBeforeUnmount(() => {
  eventBus.off("tourism-table:refresh", refreshData);
});
</script>
  
<style lang="scss" scoped>
.emoji-container {
  font-size: 1.2em;
  line-height: 1;
}
</style>