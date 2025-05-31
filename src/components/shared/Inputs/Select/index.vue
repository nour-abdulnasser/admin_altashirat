<template>
  <div>
    <label v-if="showLabel" class="input__label" :for="name">{{ t(`fields.${name}`) }}</label>
    <v-select
      :id="name"
      v-bind="$attrs"
      :items="items"
      :model-value="value"
      @update:model-value="handleInput"
      variant="outlined"
      :error-messages="errorMessage"
      :hint="hint"
      persistent-hint
      @blur="handleBlur"
    >
      <template v-for="(_, slotName) in $slots" v-slot:[slotName]="slotData">
        <slot :name="slotName" v-bind="slotData"></slot>
      </template>
    </v-select>
  </div>
</template>
  
<script setup>
import { useField } from "vee-validate";
import { useI18n } from "vue-i18n";
import { computed } from 'vue';

const { t } = useI18n();

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  name: {
    type: String,
    default: 'select', // Provide a default name to avoid undefined
  },
  showLabel: {
    type: Boolean,
    default: true,
  },
  rules: {
    type: String,
    default: '', // Provide a default empty rule
  },
  hint: {
    type: String,
    default: "",
  },
  id: {
    type: [String, Number],
    required: false,
  },
  modelValue: {
    type: [String, Number, Object, Array],
    default: null,
  }
});

// Only use vee-validate if rules are provided
const useValidation = computed(() => !!props.rules && !!props.name);

// Conditionally use vee-validate based on whether rules are provided
const fieldData = useValidation.value ? 
  useField(props.name, props.rules, {
    validateOnValueUpdate: true,
    validateOnInput: true,
    validateOnBlur: true,
  }) : 
  { 
    value: computed(() => props.modelValue), 
    errorMessage: computed(() => null), 
    handleBlur: () => {} 
  };

const { value, errorMessage, handleBlur } = fieldData;

const emit = defineEmits(["update:modelValue"]);

const handleInput = (newValue) => {
  if (useValidation.value) {
    value.value = newValue;
  }
  emit("update:modelValue", newValue);
};
</script>