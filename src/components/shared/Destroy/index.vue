<template>
  <div>
    <v-dialog max-width="500">
      <template v-slot:activator="{ props: activatorProps }">
        <v-btn class="elevation-0" icon size="small" v-bind="activatorProps">
          <Image name="trash-btn" class="w-100" />
        </v-btn>
      </template>
      <template v-slot:default="{ isActive }">
        <v-card :title="$t('common.delete')" class="pa-3">
          <v-card-text class="font-weight-bold">
            {{ $t("common.delete_confirmation_message") }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            
            <Button
              :text="$t('common.confirm_delete')"
              class="elevation-0 button--secondary-filled py-4 px-8 font-weight-bold rounded-md me-2"

              :loading="isLoading"
              @click="confirmDelete()"
            />
            <Button
              :text="$t('common.cancel')"
              class="elevation-0 button--secondary-unfilled py-4 px-8 font-weight-bold rounded-md"

              @click="isActive.value = false"
            />
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
<script setup>
import { useApi } from "@/composables/useApi";
import eventBus from "@/utils/eventBus.js";
const { _delete, isLoading } = useApi();

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
    default: "Delete",
  },
  description: {
    type: String,
    default: "Are you sure you want to delete?",
  },
});

const confirmDelete = async () => {
  try {
    const endpoint = `${props.url}/${props.id}`;
    const response = await _delete(endpoint);

    eventBus.emit(props.refreshEventKey);
  } catch (err) {
    throw err;
  }
};
</script>
