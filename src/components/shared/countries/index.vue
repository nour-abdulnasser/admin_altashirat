<template>
  <div>
    <label class="input__label" v-if="showLabel" :for="id">{{ label }}</label>
    <Field
      :name="name"
      :rules="rules"
      v-slot="{ field: countryField, errorMessage }"
      :validateOnInput="true"
    >
      <v-select
        v-bind="countryField"
        :items="countryItems"
        item-value="value"
        item-title="display"
        :disabled="disabled"
        :model-value="countryField.value"
        @update:model-value="handleInput"
        variant="outlined"
        :error-messages="errorMessage || apiError"
        :class="[customClass]"
        :style="{ maxWidth: maxWidth || 'auto', width: width || 'auto' }"
        :placeholder="placeholder || 'Select'"
        :bg-color="bgColor"
        :rounded="rounded"
      >
        <template v-slot:item="{ item, props: slotProps }">
          <v-list-item v-bind="slotProps">
            <template v-slot:prepend>
              <span class="me-2 emoji-container flag-emoji emoji-countries">{{
                item.raw.flag
              }}</span>
            </template>
            <template v-slot:title>
              <span :dir="displayMode === 'phone_code' ? 'ltr' : ''">
                {{ item.raw.display }}
              </span>
            </template>
          </v-list-item>
        </template>
        <template v-slot:selection="{ item }">
          <div class="content d-flex ga-1 align-center">
            <span class="emoji-container flag-emoji emoji-countries">{{
              item.raw.flag
            }}</span>
            <span
              class="me-2"
              :dir="displayMode === 'phone_code' ? 'ltr' : ''"
              >{{ item.raw.display }}</span
            >
          </div>
        </template>
      </v-select>
    </Field>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

import { Field } from "vee-validate";
import { useCountriesStore } from "@/stores/countries";

const props = defineProps({
  name: { type: String, required: true },
  rules: { type: String, default: "" },
  apiError: { type: [String, Array], default: null },
  modelValue: { type: String, default: "" },
  rounded: String,
  customClass: String,
  displayMode: {
    type: String,
    default: "code",
    validator: (value) => ["code", "name", "phone_code"].includes(value),
  },
  placeholder: String,
  maxWidth: String,
  width: String,
  bgColor: {
    type: String,
    default: "bg-input",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
  },
  id: {
    type: [String, Number],
    required: false,
    // default: "0",
  },
});

const emit = defineEmits(["update:modelValue"]);

const countriesStore = useCountriesStore();
const isLoading = ref(false);
const countryItems = ref([]);

// Function to format phone code from "00XXX" to "+XXX"
const formatPhoneCode = (phoneCode) => {
  if (!phoneCode) return "";
  // Remove leading zeros and add a plus sign
  if (phoneCode.startsWith("00")) {
    return "(+" + phoneCode.substring(2) + ")";
  }
  // If it doesn't start with 00, just add a plus sign if it doesn't already have one
  return phoneCode.startsWith("+") ? phoneCode : "+" + phoneCode;
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const countries = await countriesStore.fetchAllCountries();
    if (countries && Array.isArray(countries)) {
      countryItems.value = countries.map((country) => {
        // Determine which field to use as the value based on displayMode
        let valueField;
        switch (props.displayMode) {
          case "name":
            valueField = country.id; // Use country ID when displaying country names
            break;
          case "phone_code":
            valueField = country.phone_code;
            break;
          case "code":
          default:
            valueField = country.code;
        }

        // Determine what to display based on displayMode
        let displayField;
        switch (props.displayMode) {
          case "name":
            displayField = country.name;
            break;
          case "phone_code":
            // Format the phone code to display with a plus sign
            displayField = formatPhoneCode(country.phone_code);
            break;
          case "code":
          default:
            displayField = country.code;
        }

        return {
          value: valueField || "",
          display: displayField || "",
          flag: country.flag || "🏳️",
          // Store all data for reference if needed
          fullData: { ...country },
        };
      });

      if (
        props.modelValue &&
        countryItems.value.some((item) => item.value === props.modelValue)
      ) {
        emit("update:modelValue", props.modelValue);
      }
    } else {
      const fallbackData = getFallbackData();
      countryItems.value = [fallbackData];
    }
  } catch (error) {
    const fallbackData = getFallbackData();
    countryItems.value = [fallbackData];
  } finally {
    isLoading.value = false;
  }
});

// Helper function to get fallback data based on display mode
const getFallbackData = () => {
  switch (props.displayMode) {
    case "name":
      return { value: 1, display: "Saudi Arabia", flag: "🇸🇦" }; // Use ID 1 for Saudi Arabia
    case "phone_code":
      return { value: "00966", display: "+966", flag: "🇸🇦" }; // Updated to display as +966
    case "code":
    default:
      return { value: "sa", display: "sa", flag: "🇸🇦" };
  }
};


const handleInput = (newValue) => {
  emit("update:modelValue", newValue);
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (
      newValue &&
      countryItems.value.some((item) => item.value === newValue)
    ) {
    }
  }
);
</script>