<template>
  <div>
    <v-card class="card mx-3" :title="t('users.list_title')">
      <div class="pa-4">
        <MyTable
          url="/admin-panel/users"
          :loading="isLoading"
          :headers="headers"
          ref="usersTable"
          :bus-key="busKey"
        >
          <!-- eslint-disable-next-line vue/valid-v-slot vue/no-unused-vars -->
          <template #header.actions="{ header }">
            <span class="action-header">
              {{ t("users.fields.file") }}
            </span>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.phone="{ item }">
            <span dir="ltr">
              {{ fullPhone(item) }}
            </span>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot  -->
          <template #item.roles="{ item }">
            <div class="d-flex justify-start align-center">
              <div v-if="item.roles.length">
                <v-chip
                  v-for="(role, index) in rolesNames(item.roles)"
                  :key="index"
                >
                  {{ role }}
                </v-chip>
              </div>
              <div v-else>
                <v-chip> {{ t("users.fields.none") }} </v-chip>
              </div>
            </div>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.blocked="{ item }">
            <v-chip
              :color="isTrue(item.blocked) ? 'error' : 'success'"
              size="small"
              @click="() => handleToggle(item)"
            >
              {{
                isTrue(item.blocked)
                  ? t("users.fields.blocked")
                  : t("users.fields.active")
              }}
            </v-chip>
          </template>

          <!-- eslint-disable-next-line vue/valid-v-slot vue/no-unused-vars -->
          <template #item.actions="{ item }">
            <div class="d-flex gap-2 justify-start">
              <Show
                :refresh-event-key="busKey + ':refresh'"
                url="/admin-panel/users"
                :id="item.id"
                :title="t('users.user_details')"
              >
              <template #content="{ user }">
  <div class="user-details pa-2">
    <!-- User Avatar Section -->
    <div class="d-flex justify-center align-center mb-4">
      <v-avatar v-if="user.image" :size="$vuetify.display.xs ? '60' : '80'" class="elevation-2">
        <Image :url="user.image.path" class="w-100 h-100" />
      </v-avatar>
      <v-avatar v-else :size="$vuetify.display.xs ? '60' : '80'" color="primary" class="elevation-2">
        <v-icon :size="$vuetify.display.xs ? '30' : '40'" color="white">mdi-account</v-icon>
      </v-avatar>
    </div>

    <!-- Basic Information -->
    <v-container class="pa-0">
      <v-row dense>
        <!-- Left Column -->
        <v-col cols="12" sm="6">
          <div class="detail-item">
            <v-icon size="small" color="primary" class="me-1">mdi-account</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.firstname") }}:</span>
            <span class="ms-1 text-truncate">{{ user.firstname }}</span>
          </div>
          
          <div class="detail-item">
            <v-icon size="small" color="primary" class="me-1">mdi-account-outline</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.middlename") }}:</span>
            <span class="ms-1 text-truncate">{{ user.middlename }}</span>
          </div>
          
          <div class="detail-item">
            <v-icon size="small" color="primary" class="me-1">mdi-account-check</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.lastname") }}:</span>
            <span class="ms-1 text-truncate">{{ user.lastname }}</span>
          </div>
          
          <div class="detail-item">
            <v-icon size="small" color="primary" class="me-1">mdi-at</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.username") }}:</span>
            <span class="ms-1 text-truncate">{{ user.username }}</span>
          </div>
        </v-col>
        
        <!-- Right Column -->
        <v-col cols="12" sm="6">
          <div class="detail-item">
            <v-icon size="small" color="primary" class="me-1">mdi-email</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.email") }}:</span>
            <span class="ms-1 text-truncate">{{ user.email }}</span>
          </div>
          
          <div class="detail-item">
            <v-icon size="small" color="primary" class="me-1">mdi-calendar</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.birth_date") }}:</span>
            <span class="ms-1">{{ user.birth_date }}</span>
          </div>
          
          <div class="detail-item flex-wrap">
            <v-icon size="small" color="primary" class="me-1">mdi-earth</v-icon>
            <span class="text-subtitle-2 font-weight-medium text-truncate">{{ t("users.fields.country") }}:</span>
            <v-chip size="x-small" class="ms-1 mt-1 mt-sm-0">
              <span class="emoji-container emoji-countries me-1">{{ user.country.flag }}</span>
              <span>{{ user.country.name }}</span>
            </v-chip>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <v-divider class="my-3"></v-divider>

    <!-- Contact Information -->
    <div class="phone-section mb-3">
      <div class="d-flex flex-wrap align-center mb-2">
        <v-icon size="small" color="primary" class="me-1">mdi-phone</v-icon>
        <span class="text-subtitle-1 font-weight-bold me-2">{{ t("users.fields.phone") }}</span>
        <v-chip size="x-small" :color="isTrue(user.phone_verified) ? 'success' : 'error'">
          {{ isTrue(user.phone_verified) ? t("users.fields.verified") : t("users.fields.unverified") }}
        </v-chip>
      </div>
      
      <v-card variant="outlined" class="pa-2 mt-1 rounded-lg bg-grey-lighten-5">
        <div class="phone-detail-item mb-1">
          <v-icon size="small" color="grey" class="me-2 flex-shrink-0">mdi-phone-classic</v-icon>
          <span class="text-subtitle-2 font-weight-medium flex-shrink-0">{{ t("users.fields.phone_number") }}:</span>
          <span dir="ltr" class="ms-1 text-truncate">{{ fullPhone(user) }}</span>
        </div>
        
        <div class="phone-detail-item mb-1">
          <v-icon size="small" color="grey" class="me-2 flex-shrink-0">mdi-tag</v-icon>
          <span class="text-subtitle-2 font-weight-medium flex-shrink-0">{{ t("users.fields.type") }}:</span>
          <span class="ms-1 text-truncate">{{ user.phone.type }}</span>
        </div>
        
        <div class="phone-detail-item">
          <v-icon size="small" color="grey" class="me-2 flex-shrink-0">mdi-account-card</v-icon>
          <span class="text-subtitle-2 font-weight-medium flex-shrink-0">{{ t("users.fields.holderName") }}:</span>
          <span class="ms-1 text-truncate">{{ user.phone.holder_name }}</span>
        </div>
      </v-card>
    </div>

    <v-divider class="my-3"></v-divider>

    <!-- Status Information -->
    <div class="verification-section mb-3">
      <div class="d-flex align-center mb-2">
        <v-icon size="small" color="primary" class="me-1">mdi-shield-account</v-icon>
        <span class="text-subtitle-1 font-weight-bold">{{ t("users.fields.verification_status") }}</span>
      </div>
      
      <div class="verification-item mb-2 ms-2 ms-sm-4">
        <v-icon size="small" color="grey" class="me-2 flex-shrink-0">mdi-email-check</v-icon>
        <span class="text-subtitle-2 font-weight-medium me-2 flex-shrink-0">{{ t("users.fields.email") }}:</span>
        <v-chip size="x-small" :color="isTrue(user.email_verified) ? 'success' : 'error'">
          {{ isTrue(user.email_verified) ? t("users.fields.verified") : t("users.fields.unverified") }}
        </v-chip>
      </div>
    </div>

    <!-- User Status -->
    <div class="status-section mb-3">
      <div class="status-item">
        <v-icon size="small" color="primary" class="me-1 flex-shrink-0">mdi-account-lock</v-icon>
        <span class="text-subtitle-2 font-weight-medium me-2 flex-shrink-0">{{ t("users.fields.status") }}:</span>
        <v-chip size="small" :color="isTrue(user.blocked) ? 'error' : 'success'">
          {{ isTrue(user.blocked) ? t("users.fields.blocked") : t("users.fields.active") }}
        </v-chip>
      </div>
    </div>

    <!-- User Roles -->
    <div class="roles-section mb-3">
      <div class="d-flex align-center mb-2">
        <v-icon size="small" color="primary" class="me-1">mdi-shield-account</v-icon>
        <span class="text-subtitle-1 font-weight-bold">{{ t("users.fields.roles") }}</span>
      </div>
      
      <div class="d-flex flex-wrap gap-1 ms-2 ms-sm-4">
        <v-chip 
          v-for="(role, index) in rolesNames(user.roles)" 
          :key="index" 
          size="x-small" 
        
          color="primary" 
          variant="outlined"
          class="mr-1 mb-1"
        >
          {{ role }}
        </v-chip>
        <v-chip 
          v-if="!user.roles || !user.roles.length" 
          size="small" 
          color="grey"
        >
          {{ t("users.fields.none") }}
        </v-chip>
      </div>
    </div>
  </div>
</template>



                <template #loading>
                  <div class="d-flex justify-center align-center pa-4">
                    <v-progress-circular
                      indeterminate
                      color="primary"
                    ></v-progress-circular>
                    <span class="ml-2">{{
                      t("common.loading_user_info")
                    }}</span>
                  </div>
                </template>

                <template #actions="{ close }">
                  <div class="w-100 d-flex my-3 justify-end align-center">
                    <v-btn
                      class="button--secondary-filled elevation-0 py-2 px-5"
                      variant="text"
                      @click="close"
                    >
                      {{ t("buttons.close") }}
                    </v-btn>
                  </div>
                </template>
              </Show>
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
const usersTable = ref(null);
const localeStore = useAppLocaleStore();
const { appLocale } = storeToRefs(localeStore);

const busKey = "users-table";
const fullPhone = (item) => {
  const formattedCountryCode = item.phone.country_code.startsWith("00")
    ? "+" + item.phone.country_code.slice(2)
    : item.phone.country_code;

  const fullPhoneNumber = `${formattedCountryCode} ${item.phone.number}`;

  return item.extension
    ? `${fullPhoneNumber} ext. ${item.extension}`
    : fullPhoneNumber;
};
const rolesNames = (roles) => {
  return roles.map((role) => role.name);
};

const headers = [
  { title: t("users.fields.username"), key: "username", sortable: false },
  { title: t("users.fields.phone"), key: "phone", sortable: false },
  { title: t("users.fields.email"), key: "email", sortable: false },
  { title: t("users.fields.role"), key: "roles", sortable: false },
  { title: t("users.fields.status"), key: "blocked", sortable: false },
  {
    title: t("titles.fields.actions"),
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

const handleToggle = async (item) => {
  isRefreshing.value = true;

  const locale = appLocale.value || "en"; // TODO: use store

  const currentBlocked = isTrue(item.blocked);
  const newBlocked = !currentBlocked;
  // Convert boolean to numeric value (1 for blocked, 0 for active)
  const blocked = newBlocked ? 1 : 0;

  const formData = new FormData();

  // formData.append("name", item.name);
  formData.append("locale", locale);
  formData.append("blocked", blocked);
  formData.append("_method", "patch");
  try {
    await _post(`/admin-panel/users/${item.id}`, formData);
    item.blocked = blocked; // Only update the table after response is successful
    // TODO: Connect with event bus to reload table after toggle request
    eventBus.emit(`${busKey}:refresh`);
  } catch (err) {
    throw err;
  } finally {
    isRefreshing.value = false;
  }
};
const refreshData = () => {
  isRefreshing.value = true;
  usersTable.value.loadTableData().finally(() => {
    isRefreshing.value = false;
  });
};
onMounted(() => {
  eventBus.on(`${busKey}:refresh`, refreshData);
});
onBeforeUnmount(() => {
  eventBus.off(`${busKey}:refresh`, refreshData);
});
</script>
<style lang="scss" scoped>
.user-details {
  .detail-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    flex-wrap: wrap;
  }
  
  .phone-detail-item, .verification-item, .status-item {
    display: flex;
    align-items: center;
    word-break: break-word;
  }
  
  @media (max-width: 600px) {
    .detail-item, .phone-detail-item, .verification-item, .status-item {
      font-size: 0.875rem;
    }
  }
}
</style>