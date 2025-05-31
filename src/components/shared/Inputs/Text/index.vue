<template>
  <div class="">
    <label class="input__label" v-if="showLabel" :for="id">{{ label }}</label>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field, errorMessage }"
      :validateOnInput="true"
      :field-name="fieldName"
      :class="[customClass, 'mr-2']"
      bg-color="bg-input"
    >
      <v-text-field
        :disabled="disabled"
        :placeholder="placeholder"
        v-bind="field"
        :hint="hint"
        persistent-hint
        :id="id"
        variant="outlined"
        :error-messages="errorMessage || apiError"
        :rounded="rounded"
      >
      </v-text-field>
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
  placeholder: String,
  disabled: {
    type: Boolean,
    default: false,
  },
  customClass: {
    type: String,
    default: "customClass",
  },
  apiError: {
    type: Array,
    default: null,
  },
  inputDescription: String,
  //   modelValue: String,
  name: {
    type: String,
    required: true,
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: String,
  },
  hint: {
    type: String,
    default: "",
  },
  rounded: {
    type: String,
    default: "md",
  },
});
const emit = defineEmits(["update:modelValue"]);
</script>

