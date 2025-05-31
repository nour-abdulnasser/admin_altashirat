<template>
  <div>
    <v-data-table
      v-bind="$attrs"
      :headers="headers"
      :items="tableItems"
      class="w-100 custom-bordered-table"
      hide-default-footer
      :loading="isLoading"
      :items-per-page="-1"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="slotData">
        <slot v-bind="slotData" :name="name"></slot>
      </template>
    </v-data-table>
    <Pagination
      ref="paginationRef"
      :length="paginationData.last_page"
      :current_page="paginationData.current_page"
      @update:page="handlePageChange"
    />
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount, watch } from "vue";
import eventBus from "@/utils/eventBus.js";
import { useApi } from "@/composables/useApi";
import { useRoute, useRouter } from "vue-router";

const { _get, isLoading } = useApi();
const route = useRoute();
const router = useRouter();

const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
  },
  url: {
    type: String,
    required: true,
  },
  busKey: {
    type: String,
    required: true,
  }
});

let isRequesting = false;
const tableItems = ref([]);
const paginationRef = ref(null);

const paginationData = ref({
  current_page: parseInt(route.query.page) || 1,
  per_page: 20,
  total: 0,
  last_page: 1,
});

const handlePageChange = (page) => {
  router.push({
    query: { ...route.query, page }
  });
  
  loadTableData(page);
};

const loadTableData = async (page = paginationData.value.current_page) => {
  if (isRequesting) return;
  isRequesting = true;
  try {
    const response = await _get(props.url, { page });
    tableItems.value = response.data.data;
    paginationData.value = response.data.meta;
  } catch (error) {
    throw error;
  } finally {
    isRequesting = false;
  }
};

defineExpose({ loadTableData });

onMounted(() => {
  const pageFromQuery = parseInt(route.query.page) || 1;
  loadTableData(pageFromQuery);
  
  eventBus.on(`${props.busKey}:refresh`, () => {
    loadTableData(paginationData.value.current_page);
  });
});

onBeforeUnmount(() => {
  eventBus.off(`${props.busKey}:refresh`);
});
</script>