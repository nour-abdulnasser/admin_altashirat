<template>
  <div>
    <v-pagination
      v-if="length>1"
      :length="length"
      :model-value="internalPage"
      @update:model-value="handlePageChange"
      show-arrows
      total-visible="4"
    ></v-pagination>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  length: {
    type: Number,
    required: true,
  },
  current_page: {
    type: [Number, String],
    default: 1,
  },
});

const emit = defineEmits(["update:page"]);
// NTS: Vue props are read-only from within a component,  props can't
// be mutated directly. So we want to create a local reactive
// reference so that the pagination component can change page value
const internalPage = ref(props.current_page);

// Watch for prop changes from parent.. Paired with encapsulation explain in the pervious comment
watch(
  () => props.current_page,
  (newPage) => {
    internalPage.value = newPage;
  }
);

// Handle page changes from inside the pagination component
const handlePageChange = (page) => {
  internalPage.value = page;
  emit("update:page", page);
};

// Method to go to a specific page
// Expose to parent
const goToPage = (page) => {
  if (page >= 1 && page <= props.length) {
    internalPage.value = page;
    emit("update:page", page);
  }
};

// Expose pagination methods and state
defineExpose({
  goToPage,
  currentPage: internalPage,
});
</script>