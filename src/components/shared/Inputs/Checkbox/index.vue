<template>
  <div class="">
    <label class="input__label mr-2" :for="id">{{ label }}</label>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field, errorMessage }"
      :validateOnInput="true"
      :field-name="fieldName"
    >
      <v-checkbox
        v-model="field.value"
        :id="id"
        hide-details="false"
        :error="!!errorMessage || !!apiError"
        @update:modelValue="field.onChange"
      />
      <span v-if="errorMessage || apiError" class="error-message">
        {{ errorMessage || apiError }}
      </span>
    </Field>
    <p class="input__description">{{ inputDescription }}</p>
  </div>
</template>

<script setup>
import { Field } from "vee-validate";

defineProps({
  id: {
    type: [String, Number],
    required: false,
    // default: "0",
  },
  label: String,
  fieldName: String,
  apiError: {
    type: [Array, String],
    default: null,
  },
  inputDescription: String,
  name: {
    type: String,
    required: true,
  },
  rules: {
    type: String,
  },
});
</script>