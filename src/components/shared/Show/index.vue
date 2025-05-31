<template>
  <div>
    <!-- Popup component to display details.. used in Users -->
    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn
          :loading="isLoading"
          @click="fetchUser(id)"
          class="elevation-0"
          icon
          size="small"
          v-bind="activatorProps"
        >
          <Image class="w-100" name="show-btn" alt="" />
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card class="card mb-6" :title="title">
          <v-card-text v-if="user">
            <slot name="content" :user="user">
              <div>{{ user.username }}</div>
            </slot>
          </v-card-text>
          <v-card-text v-else>
            <slot name="loading"> Loading user data... </slot>
          </v-card-text>

          <v-card-actions>
            <slot name="actions" :close="() => (isActive.value = false)">
              <v-btn text="OK" @click="isActive.value = false"></v-btn>
            </slot>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script setup>
import { ref } from "vue";

import { useApi } from "@/composables/useApi";

const { _get, isLoading } = useApi();

const user = ref(null);
const props = defineProps({
  id: {
    type: [String, Number],
    required: false,
  },
  url: {
    type: String,
    required: true,
  },
  refreshEventKey: {
    type: String,
  },
  title: {
    type: String,
    default: "Show user",
  },
  description: {
    type: String,
    default: "Full user data",
  },
});

const fetchUser = async (userId) => {
  try {
    user.value = null; // Reset user before fetching
    const endpoint = `${props.url}/${userId}`;
    const response = await _get(endpoint);
    user.value = response.data.user;
  } catch (err) {
    throw err;
  }
};
</script>
  
