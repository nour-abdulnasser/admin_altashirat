<template>
  <v-alert
    v-bind="$attrs"
    @click:close="clearNotification"
    closable
    :text="notification.text"
    :type="notification.type"
    variant="tonal"
    density="comfortable"
    class="py-3 d-flex justify-center  align-center"
    :icon="false"
  >
    <template v-slot:append>
      <div class="notification__icon">
        <Image class="w-100 " :name="notification.type" />
      </div>
    </template>
  </v-alert>
</template>

<script setup>
import { storeToRefs } from "pinia";

import { useNotificationStore } from "@/stores/notification";

const notificationStore = useNotificationStore();
const { notification } = storeToRefs(notificationStore);
const { clearNotification } = notificationStore;
</script>
