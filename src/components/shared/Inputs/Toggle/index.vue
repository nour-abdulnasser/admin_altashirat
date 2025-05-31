<template>
  <div>
    <v-switch
      :label="label"
      :model-value="modelValue"
      :loading="loading"
      inset
      @update:model-value="$emit('update:modelValue', $event)"
    ></v-switch>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});
defineEmits(["update:modelValue"]);
</script>
