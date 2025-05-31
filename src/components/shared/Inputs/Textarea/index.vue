<template>
  <div>
    <label class="input__label" :for="id">{{ label }}</label>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field, errorMessage }"
      :validateOnInput="true"
      :field-name="fieldName"
    >
      <v-textarea
        v-bind="field"
        :id="id"
        variant="outlined"
        :error-messages="errorMessage || apiError"
      >
      </v-textarea>
    </Field>
    <p class="input__description">{{ inputDescription }}</p>
  </div>
</template>
  <script setup>
import { Field } from "vee-validate";

const props = defineProps({
  id: {
    type: [String, Number],
    required: false,
    // default: 0,

  },
  label: String,
  fieldName: String,
  apiError: {
    type: Array,
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
const emit = defineEmits(["update:modelValue"]);
</script>