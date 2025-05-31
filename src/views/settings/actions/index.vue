<template>
  <div class="d-flex justify-center align-center">
    <v-card
      class="card mb-6 w-100 w-sm-75 mt-4 mt-sm-10"
      v-if="formReady"
      :title="t('settings.edit_settings')"
    >
      <Form
        @submit="handleSubmit"
        class="mt-6 mx-2 mx-sm-4"
        :initial-values="formData"
      >
        <!-- Text Input -->
        <div class="mb-4" v-if="layout === 'text'">
          <Text
            id="settings-value"
            :label="getSettingDisplayName(settingKey)"
            name="value"
            :rules="validation_rule"
            :api-error="fieldErrors?.value"
            :field-name="t('fields.value')"
            :hint="getInputHint()"
            :placeholder="getInputPlaceholder()"
          />
        </div>

        <!-- Number Input -->
        <div class="mb-4" v-if="layout === 'number'">
          <Text
            id="settings-value"
            :label="getSettingDisplayName(settingKey)"
            name="value"
            :rules="validation_rule"
            :api-error="fieldErrors?.value"
            :field-name="t('fields.value')"
            :hint="getInputHint()"
            :placeholder="getInputPlaceholder()"
            type="number"
          />
        </div>

        <!-- Textarea Input -->
        <div class="mb-4" v-if="layout === 'textarea'">
          <Textarea
            id="settings-value"
            :label="getSettingDisplayName(settingKey)"
            name="value"
            :rules="validation_rule"
            :api-error="fieldErrors?.value"
            :field-name="t('fields.value')"
            :hint="getInputHint()"
            :placeholder="getInputPlaceholder()"
            :rows="6"
          />
        </div>

        <!-- Checkbox Input -->
        <div class="mb-4" v-if="layout === 'checkbox'">
          <Checkbox
            id="settings-value"
            :label="getSettingDisplayName(settingKey)"
            name="value"
            :rules="validation_rule"
            :api-error="fieldErrors?.value"
            :field-name="t('fields.value')"
            :hint="getInputHint()"
          />
        </div>

        <!-- Range Input -->
        <div class="mb-4" v-if="layout === 'range'">
          <Range
            id="settings-value"
            :label="getSettingDisplayName(settingKey)"
            name="value"
            :rules="validation_rule"
            :api-error="fieldErrors?.value"
            :field-name="t('fields.value')"
            v-model="formData.value"
            :hint="getInputHint()"
            :min="getMinValue()"
            :max="getMaxValue()"
          />
        </div>

        <!-- Locale Selector for text and textarea -->
        <div class="mb-4" v-if="layout === 'textarea' || layout === 'text'">
          <LocaleSelector
            v-model="formLocale"
            :title="t('fields.locale')"
            :onLocaleSelected="handleLocaleSelector"
            :disabled="!formReady"
            :hint="t('hints.locale')"
            variant="outlined"
            :show-globe="true"
            :translation="true"
          />
        </div>

        <div
          class="d-flex flex-column flex-sm-row my-6"
          :class="{ 'justify-sm-end': true }"
        >
          <Button
            type="submit"
            class="elevation-0 button--secondary-filled py-2 py-sm-4 px-4 px-sm-8 font-weight-bold rounded-md me-0 me-sm-4"
            :loading="isSubmitting"
            :text="isEdit ? t('buttons.update') : t('buttons.create')"
          />

          <Button
            type="button"
            variant="outlined"
            class="elevation-0 button--secondary-unfilled py-2 py-sm-4 px-4 px-sm-8 font-weight-bold rounded-md mt-2 mt-sm-0"
            :text="t('buttons.cancel')"
            @click="goBack"
          />
        </div>
      </Form>
    </v-card>
    <div v-else class="d-flex justify-center my-6">
      <v-progress-circular color="primary" indeterminate />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from "vue";
import { Form } from "vee-validate";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";
import { useApi } from "@/composables/useApi";
import { storeToRefs } from "pinia";
import { useApiErrorStore } from "@/stores/apiError";
import eventBus from "@/utils/eventBus";
import { useFormLocaleStore } from "@/stores/formLocale";
import { useSettingsStore } from "@/stores/settings";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { _get, _post } = useApi();

const apiErrorStore = useApiErrorStore();
const { fieldErrors } = storeToRefs(apiErrorStore);

const formLocaleStore = useFormLocaleStore();
const { setFormLocale } = formLocaleStore;
const { formLocale } = storeToRefs(formLocaleStore);

// Get the settings store for additional reference data
const settingsStore = useSettingsStore();

const handleLocaleSelector = async (value) => {
  formReady.value = false;
  setFormLocale(value);

  try {
    if (settingsId.value) {
      const response = await _get(
        `/admin-panel/settings/${settingsId.value}`,
        {}, // Empty params
        { "x-locale": value } // Custom headers
      );

      const settingsData = response.data.setting;

      validation_rule.value = settingsData.validation_rule;
      layout.value = settingsData.layout;

      formData.value = {
        value:
          settingsData.layout === "checkbox"
            ? Boolean(Number(settingsData.value))
            : settingsData.layout === "range"
            ? Number(settingsData.value) || 0
            : settingsData.value || "",
      };
    } else {
      router.push("/settings");
    }
  } catch (error) {
    console.error("Failed to fetch localized data:", error);
  } finally {
    formReady.value = true;
  }
};

const isEdit = computed(() => true);
const settingsId = computed(() => route.params.id);
const settingKey = ref("");

const formData = ref({
  key: "",
  value: false,
});

const formReady = ref(false);
const isSubmitting = ref(false);
const layout = ref(null);
const validation_rule = ref("required");

// Helper functions for better UI labels and hints
const getSettingDisplayName = (key) => {
  const displayNames = {
    terms_and_conditions: t("settings.display_names.terms_and_conditions"),
    usage_policy: t("settings.display_names.usage_policy"),
    additional_tax_rate: t("settings.display_names.additional_tax_rate"),
    fixed_tax_amount: t("settings.display_names.fixed_tax_amount"),
    welcome: t("settings.display_names.welcome"),
    contacts_email: t("settings.display_names.contacts_email"),
    contacts_phone: t("settings.display_names.contacts_phone"),
    contacts_address: t("settings.display_names.contacts_address"),
    privacy_policy: t("settings.display_names.privacy_policy"),
    about1: t("settings.display_names.about1"),
    about2: t("settings.display_names.about2"),
    user_must_verify_email: t("settings.display_names.user_must_verify_email"),
    email_verification_subject: t(
      "settings.display_names.email_verification_subject"
    ),
    email_verification_body: t(
      "settings.display_names.email_verification_body"
    ),
    email_verified_successfully_subject: t(
      "settings.display_names.email_verified_successfully_subject"
    ),
    email_verified_successfully_body: t(
      "settings.display_names.email_verified_successfully_body"
    ),
    reset_password_email_subject: t(
      "settings.display_names.reset_password_email_subject"
    ),
    reset_password_email_body: t(
      "settings.display_names.reset_password_email_body"
    ),
    guest_set_password_email_subject: t(
      "settings.display_names.guest_set_password_email_subject"
    ),
    guest_set_password_email_body: t(
      "settings.display_names.guest_set_password_email_body"
    ),
  };

  return (
    displayNames[key] ||
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  );
};

const getInputHint = () => {
  // Setting-specific hints
  if (settingKey.value) {
    if (settingKey.value === "terms_and_conditions") {
      return t("settings.hints.terms_and_conditions");
    }
    if (settingKey.value === "privacy_policy") {
      return t("settings.hints.privacy_policy");
    }
    if (settingKey.value.includes("email_verification")) {
      return t("settings.hints.email_verification");
    }
    if (settingKey.value === "user_must_verify_email") {
      return t("settings.hints.user_must_verify_email");
    }
    if (settingKey.value === "welcome") {
      return t("settings.hints.welcome_message");
    }
    if (settingKey.value === "additional_tax_rate") {
      return t("settings.hints.tax_rate");
    }
    if (settingKey.value === "contacts_email") {
      return t("settings.hints.contacts_email");
    }
    if (settingKey.value === "contacts_phone") {
      return t("settings.hints.contacts_phone");
    }
    if (settingKey.value === "contacts_address") {
      return t("settings.hints.contacts_address");
    }

    // Generic hints by type
    if (layout.value === "text") {
      return t("settings.hints.text");
    }
    if (layout.value === "number") {
      return t("settings.hints.number");
    }
    if (layout.value === "textarea") {
      return t("settings.hints.textarea");
    }
    if (layout.value === "checkbox") {
      return t("settings.hints.checkbox");
    }
    if (layout.value === "range") {
      return t("settings.hints.range");
    }
  }

  return "";
};

const getInputPlaceholder = () => {
  // Setting-specific placeholders
  if (settingKey.value) {
    if (settingKey.value.includes("email") && layout.value === "text") {
      return "example@domain.com";
    }
    if (settingKey.value.includes("subject")) {
      return t("settings.placeholders.email_subject");
    }
    if (settingKey.value.includes("body")) {
      return t("settings.placeholders.email_body");
    }

    // Generic placeholders by layout type
    if (layout.value === "text") {
      return t("settings.placeholders.text");
    }
    if (layout.value === "number") {
      return t("settings.placeholders.number");
    }
    if (layout.value === "textarea") {
      return t("settings.placeholders.textarea");
    }
  }

  return "";
};

// Extract min/max values from validation rule for range and number inputs
const getMinValue = () => {
  if (!validation_rule.value) return 0;
  const minMatch = validation_rule.value.match(/min:(\d+)/);
  return minMatch ? parseInt(minMatch[1]) : 0;
};

const getMaxValue = () => {
  if (!validation_rule.value) return 100;
  const maxMatch = validation_rule.value.match(/max:(\d+)/);
  return maxMatch ? parseInt(maxMatch[1]) : 100;
};

const handleSubmit = async (values) => {
  isSubmitting.value = true;

  const submitData = new FormData();

  const checkboxValue =
    values.value === true ? 1 : values.value === false ? 0 : values.value;
  submitData.append("value", checkboxValue);
  submitData.append("locale", formLocale.value || "en");
  submitData.append("_method", "put");

  try {
    const endpoint = `/admin-panel/settings/${settingsId.value}`;

    const response = await _post(endpoint, submitData);

    eventBus.emit("settings-table:refresh");
    router.push("/settings");
  } catch (error) {
    throw error;
  } finally {
    isSubmitting.value = false;
  }
};

const fetchSettingsData = async () => {
  try {
    if (settingsId.value) {
      const response = await _get(`/admin-panel/settings/${settingsId.value}`);

      const settingsData = response.data.setting;

      // Store the setting key for better UI handling
      settingKey.value = settingsData.key;
      layout.value = settingsData.layout;
      validation_rule.value = settingsData.validation_rule;

      formData.value = {
        value:
          settingsData.layout === "checkbox"
            ? Boolean(Number(settingsData.value))
            : settingsData.layout === "range"
            ? Number(settingsData.value) || 0
            : settingsData.value || "",
      };

      if (settingsData.locale) {
        setFormLocale(settingsData.locale);
      }
    } else {
      router.push("/settings");
    }
  } catch (error) {
    throw error;
    layout.value = "checkbox";
    formData.value = { key: "", value: true };
  } finally {
    formReady.value = true;
  }
};

const goBack = () => {
  router.push("/settings");
};

onMounted(async () => {
  await fetchSettingsData();
});
</script>