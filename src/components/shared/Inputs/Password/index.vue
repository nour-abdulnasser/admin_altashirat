<template>
  <div>
    <label class="input__label" :for="id">{{ $t(`labels.${name}`) }}</label>
    <v-text-field
      :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="visible ? 'text' : 'password'"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      :placeholder="placeholder"
      @click:append-inner="visible = !visible"
      :id="id"
      :model-value="value"
      @update:model-value="handleInput"
      @blur="handleBlur"
      :hint="hint"
      persistent-hint
      :autocomplete="autocomplete"
      :error-messages="errorMessage || apiError"
    ></v-text-field>
  </div>
</template>
     <script setup>
import { ref } from "vue";
import { useField } from "vee-validate";

const props = defineProps({
  id: {
    type: [String, Number],
    required: false,
 
    // default: 0,
  },
  label: String,
  name: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
  },
  rules: {
    type: String,
    required: true,
  },
  apiError: {
    type: Array,
    default: null,
  },
  hint: {
    type: String,
    default: "",
  },
  autocomplete: {
    type: String,
    default: "current-password",
  },
});

const { value, errorMessage, handleBlur } = useField(props.name, props.rules, {
  validateOnValueUpdate: true,
  validateOnInput: true,
  validateOnBlur: true,
});

const emit = defineEmits(["update:modelValue"]);
const handleInput = (newValue) => {
  if (typeof newValue === "string") {
    value.value = newValue;
    emit("update:modelValue", newValue);
  }
};
const visible = ref(false);
</script>
     