<template>
  <div class="">
    <label class="input__label" :for="id">{{ label }}</label>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field, errorMessage }"
      :validateOnInput="true"
      :field-name="fieldName"
    >
      <v-slider
        v-bind="field"
        :id="id"
        variant="outlined"
        :min="min"
        :max="max"
        :step="1"
        :error-messages="errorMessage || apiError"
        v-model="localValue"
        @update:modelValue="onValueChange"
      />
    </Field>
    <p class="input__description">{{ inputDescription }}</p>
    <p class="range-value">
      {{ t("settings.selected_value") }} : {{ localValue }}
    </p>
  </div>
</template>

<script setup>
import { Field } from "vee-validate";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

// Define props
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
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  modelValue: {
    String,
  },
});

const emit = defineEmits(["update:modelValue"]);

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

const onValueChange = (newValue) => {
  localValue.value = newValue;
  emit("update:modelValue", newValue);
};
</script>