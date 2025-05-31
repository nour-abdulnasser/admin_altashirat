<template>
  <div class="phone-component" :dir="isRtl ? 'rtl' : 'ltr'">
    <label class="input__label">{{ label }}</label>
    <div variant="outlined" class="d-flex position-relative overflow-hidden">
      <Text
        :name="`${name}.number`"
        :showLabel="false"
        :hint="$t('hints.phone.number')"
        :rules="numberRules"
        :apiError="apiError?.number"
        v-model="phoneNumber"
        prependIcon="mdi-cellphone"
        :iconColor="iconColor"
        style="width: 100%"
        :rounded="rounded ? `s-${rounded}` : 's-xl'"
       
        :disabled="disabled"
      />
      <Countries
        :disabled="disabled"
        :name="`${name}.country_code`"
        :rules="countryRules"
        :apiError="apiError?.country_code"
        v-model="countryCode"
        class="country-selector position-absolute no-menu-icon"
        displayMode="phone_code"
        maxWidth="120px"
        bg-color="primary"
        :rounded="rounded ? `s-${rounded}` : `${roundedCountry}-0`"
        :style="countrySelectorPosition"
      />
    </div>
    <p v-if="inputDescription" class="input__description">
      {{ inputDescription }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n"; 

const { locale } = useI18n();

const props = defineProps({
  name: { type: String, required: true },
  label: { type: String, default: "Phone" },
  countryRules: { type: String, default: "required" },
  numberRules: { type: String, default: "required" },
  apiError: { type: Object, default: () => ({}) },
  inputDescription: String,
  modelValue: { type: Object, default: () => ({}) },
  validateCountry: { type: Boolean, default: true },
  iconColor: { type: String, default: "primary" },
  rounded: {
    type: String,
    default: "0",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const countryCode = ref(props.modelValue.country_code || "");
const phoneNumber = ref(props.modelValue.number || "");

const isRtl = computed(() => locale.value === "ar");

const roundedCountry = computed(() => (isRtl.value === 'rtl' ? "e" : "s"));

const countrySelectorPosition = computed(() => ({
  top: 0,
  [isRtl.value ? "left" : "right"]: 0,
}));

watch([countryCode, phoneNumber], ([newCountryCode, newPhoneNumber]) => {
  emit("update:modelValue", {
    country_code: newCountryCode,
    number: newPhoneNumber,
  });
});

watch(
  () => props.modelValue,
  (newValue) => {
    countryCode.value = newValue.country_code || "";
    phoneNumber.value = newValue.number || "";
  },
  { deep: true }
);
</script>
