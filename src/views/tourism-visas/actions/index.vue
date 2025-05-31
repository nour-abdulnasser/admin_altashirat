<template>
  <div>
    <v-container>
      <div class="d-flex align-center mb-4">
        <v-btn
          color="primary"
          variant="text"
          @click="goBack"
          :prepend-icon="
            appLocale === 'ar' ? 'mdi-arrow-right' : 'mdi-arrow-left'
          "
          class="px-2 me-2 py-5 d-flex justify-center align-center"
        >
          {{ t("buttons.back") }}
        </v-btn>
        <h2 class="text-h5 ml-2">{{ t("tourismVisas.details_title") }}</h2>
      </div>

      <div v-if="isLoading" class="d-flex justify-center my-8">
        <v-progress-circular color="primary" indeterminate />
      </div>

      <div v-else-if="visaData">
        <div class="mb-4">
          <div class="d-flex flex-wrap justify-space-between align-center mb-3">
            <h3 class="text-h6 mb-2 mb-sm-0">
              {{ t("tourismVisas.fields.application_status") }}
            </h3>

            <div
              v-if="!isInFinalState && visaData.can_update_status"
              class="status-select"
            >
              <Select
                v-model="selectedStatus"
                :items="availableStatuses"
                item-title="name"
                item-value="id"
                :label="t('tourismVisas.buttons.change_to')"
                density="comfortable"
                variant="outlined"
                hide-details
                class="mt-1 mt-sm-0"
                return-object
                :show-label="false"
                @update:model-value="handleStatusChange"
              >
                <template v-slot:prepend>
                  <v-icon color="primary" size="small">mdi-update</v-icon>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar
                        :color="item.raw.color"
                        size="24"
                        class="me-2"
                      ></v-avatar>
                    </template>
                    <!-- <v-list-item-title>{{ item.raw.name }}</v-list-item-title> -->
                  </v-list-item>
                </template>
              </Select>
            </div>
          </div>

          <v-timeline density="compact" align="start" class="mt-3">
            <v-timeline-item
              v-for="status in activeStatuses"
              :key="status.id"
              :dot-color="status.color"
              icon="mdi-check-circle"
              size="small"
            >
              <div class="d-flex flex-column">
                <div class="d-flex align-center mb-1">
                  <v-chip
                    :color="status.color"
                    size="small"
                    class="font-weight-medium me-2"
                  >
                    {{ status.name }}
                  </v-chip>
                </div>
                <div v-if="status.activated_at" class="text-caption text-grey">
                  {{ formatDate(status.activated_at) }}
                </div>
              </div>
            </v-timeline-item>
          </v-timeline>
        </div>

        <v-card class="mb-4 rounded-lg elevation-0 border-sm card">
          <v-card-title class="pb-0 mb-5 text-h6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="me-2">mdi-account</v-icon>
              <span>{{ t("tourismVisas.sections.personal_info") }}</span>
            </div>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.name") }}:
                  </div>
                  <div class="info-value">
                    {{ visaData.firstname }} {{ visaData.middlename }}
                    {{ visaData.lastname }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.phone") }}:
                  </div>
                  <div class="info-value" dir="ltr">
                    {{ formatPhone(visaData.phone) }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.contact_email") }}:
                  </div>
                  <div class="info-value">{{ visaData.contact_email }}</div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.birthdate") }}:
                  </div>
                  <div class="info-value">
                    {{ formatDate(visaData.birthdate) }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.gender") }}:
                  </div>
                  <div class="info-value">
                    {{
                      visaData.gender === 0
                        ? t("tourismVisas.gender.male")
                        : t("tourismVisas.gender.female")
                    }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.nationality") }}:
                  </div>
                  <div class="info-value">
                    <v-chip size="small">
                      <span class="emoji-container emoji-countries me-1">{{
                        visaData.nationality.flag
                      }}</span>
                      {{ visaData.nationality.name }}
                    </v-chip>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4 rounded-lg elevation-0 border-sm card">
          <v-card-title class="pb-0 mb-5 text-h6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="me-2"
                >mdi-card-account-details</v-icon
              >
              <span>{{ t("tourismVisas.sections.visa_info") }}</span>
            </div>
          </v-card-title>

          <v-card-text>
            <v-row>
              <v-col cols="12" sm="6">
                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.passport_number") }}:
                  </div>
                  <div class="info-value font-weight-medium">
                    {{ visaData.passport_number }}
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.destination_country") }}:
                  </div>
                  <div class="info-value">
                    <v-chip size="small">
                      <span class="emoji-container emoji-countries me-1">{{
                        visaData.destination_country.flag
                      }}</span>
                      {{ visaData.destination_country.name }}
                    </v-chip>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.purpose_of_visit") }}:
                  </div>
                  <div class="info-value">{{ visaData.purpose_of_visit }}</div>
                </div>
              </v-col>

              <v-col cols="12" sm="6">
                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.adults_count") }}:
                  </div>
                  <div class="info-value">{{ visaData.adults_count }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.children_count") }}:
                  </div>
                  <div class="info-value">{{ visaData.children_count }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.request_date") }}:
                  </div>
                  <div class="info-value">
                    {{ formatDate(visaData.statuses[0].activated_at) }}
                  </div>
                </div>
              </v-col>

              <v-col cols="12">
                <div class="info-item">
                  <div class="info-label">
                    {{ t("tourismVisas.fields.message") }}:
                  </div>
                  <div class="info-value bg-grey-lighten-4 pa-2 rounded">
                    {{ visaData.message || t("common.none") }}
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="rounded-lg elevation-0 border-sm card">
          <v-card-title class="pb-0 mb-5 text-h6">
            <div class="d-flex align-center">
              <v-icon color="primary" class="me-2">mdi-attachment</v-icon>
              <span>{{ t("tourismVisas.sections.attachments") }}</span>
            </div>
          </v-card-title>

          <v-card-text>
            <h4 class="text-subtitle-1 mb-2">
              {{ t("tourismVisas.fields.passport_images") }}
            </h4>
            <v-row class="mb-4">
              <v-col
                v-for="(image, index) in visaData.passport_images"
                :key="index"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card variant="outlined" class="h-100">
                  <div class="d-flex justify-center align-center pa-2">
                    <v-img :src="image.path" height="150" cover class="rounded">
                      <template v-slot:placeholder>
                        <div
                          class="d-flex align-center justify-center fill-height"
                        >
                          <v-progress-circular
                            color="primary"
                            indeterminate
                          ></v-progress-circular>
                        </div>
                      </template>
                    </v-img>
                  </div>
                  <v-card-actions>
                    <v-btn
                      block
                      variant="text"
                      color="primary"
                      :href="image.path"
                      target="_blank"
                    >
                      <v-icon size="small" class="me-1">mdi-open-in-new</v-icon>
                      {{ t("buttons.view") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <h4 class="text-subtitle-1 mb-2">
              {{ t("tourismVisas.fields.documents") }}
            </h4>
            <v-row>
              <v-col
                v-for="(attachment, index) in visaData.attachments"
                :key="index"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card variant="outlined" class="h-100">
                  <v-card-text class="d-flex align-center pa-2">
                    <v-icon size="large" color="error" class="me-2"
                      >mdi-file-pdf-box</v-icon
                    >
                    <div class="text-truncate">
                      {{
                        attachment.title ||
                        `${t("tourismVisas.fields.document")} ${index + 1}`
                      }}
                    </div>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn
                      block
                      variant="text"
                      color="primary"
                      :href="attachment.path"
                      target="_blank"
                    >
                      <v-icon size="small" class="me-1">mdi-download</v-icon>
                      {{ t("buttons.download") }}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>

              <v-col v-if="!visaData.attachments.length" cols="12">
                <div class="text-grey text-center py-4">
                  {{ t("common.no_documents") }}
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-dialog v-model="statusConfirmDialog" max-width="400">
          <v-card class="pa-3">
            <v-card-title class="text-h6">{{
              t("tourismVisas.dialogs.confirm_status_update")
            }}</v-card-title>
            <v-card-text v-if="selectedStatus">
              <p>{{ t("tourismVisas.dialogs.status_change_prompt") }}</p>
              <div class="d-flex align-center mt-4">
                <v-avatar
                  :color="selectedStatus.color"
                  size="24"
                  class="me-3"
                ></v-avatar>
                <span class="text-body-1 font-weight-medium">{{
                  selectedStatus.name
                }}</span>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                variant="text"
                class="button--secondary-unfilled"
                @click="cancelStatusChange"
              >
                {{ t("buttons.cancel") }}
              </v-btn>
              <v-btn
                class="elevation-0 button--secondary-filled"
                variant="flat"
                @click="confirmStatusChange"
                :loading="updatingStatus"
              >
                {{ t("buttons.confirm") }}
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <div v-else class="text-center py-8">
        <v-icon size="48" color="grey">mdi-alert-circle-outline</v-icon>
        <div class="text-h6 mt-2">{{ t("errors.visa_not_found") }}</div>
        <v-btn color="primary" variant="text" @click="goBack" class="mt-4">
          {{ t("buttons.back_to_list") }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";

import { useApi } from "@/composables/useApi.js";
import eventBus from "@/utils/eventBus.js";

import { useAppLocaleStore } from "@/stores/appLocale";

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const { _get, _post, isLoading } = useApi();

const appLocaleStore = useAppLocaleStore();
const { appLocale } = storeToRefs(appLocaleStore);

const visaId = computed(() => route.params.id);

const visaData = ref(null);
const selectedStatus = ref(null);
const statusConfirmDialog = ref(false);
const updatingStatus = ref(false);

const isInFinalState = computed(() => {
  if (!visaData.value) return false;

  return visaData.value.statuses.some(
    (status) =>
      status.active &&
      (status.name === "Accepted" || status.name === "Rejected")
  );
});

const availableStatuses = computed(() => {
  if (!visaData.value) return [];

  return [...visaData.value.statuses]
    .filter((status) => !status.active)
    .sort((a, b) => a.id - b.id);
});

const activeStatuses = computed(() => {
  if (!visaData.value) return [];

  return [...visaData.value.statuses]
    .filter((status) => status.active && status.activated_at)
    .sort((a, b) => new Date(a.activated_at) - new Date(b.activated_at));
});

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

const formatTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const formatDateTime = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const fetchVisaData = async () => {
  try {
    const response = await _get(`/admin-panel/tourism-visa/${visaId.value}`);
    visaData.value = response.data.tourism_visa;
  } catch (error) {
    console.error("Failed to fetch visa data:", error);
  }
};

const handleStatusChange = () => {
  if (selectedStatus.value) {
    statusConfirmDialog.value = true;
  }
};

const cancelStatusChange = () => {
  statusConfirmDialog.value = false;
  selectedStatus.value = null;
};

const confirmStatusChange = async () => {
  if (!selectedStatus.value) return;

  updatingStatus.value = true;

  try {
    const formData = new FormData();
    formData.append("status", selectedStatus.value.id);
    formData.append("_method", "patch");

    await _post(`/admin-panel/tourism-visa/${visaId.value}`, formData);

    await fetchVisaData();
    statusConfirmDialog.value = false;
    selectedStatus.value = null;

    eventBus.emit("tourism-table:refresh");
  } catch (error) {
    console.error("Failed to update status:", error);
  } finally {
    updatingStatus.value = false;
  }
};

const returnPage = computed(() => route.query.returnPage || 1);

const goBack = () => {
  router.push({
    path: "/tourism-visas",
    query: { page: returnPage.value },
  });
};

onMounted(() => {
  fetchVisaData();
});
</script>
  
  <style scoped>
.info-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
}

.info-label {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  margin-bottom: 4px;
  font-size: 0.875rem;
}

.info-value {
  font-size: 1rem;
}

.emoji-container {
  font-size: 1.2em;
  line-height: 1;
}

.status-select {
  min-width: 200px;
  max-width: 250px;
}

@media (max-width: 600px) {
  .info-item {
    margin-bottom: 12px;
  }

  .status-select {
    width: 100%;
    max-width: 100%;
    margin-top: 8px;
  }
}
</style>