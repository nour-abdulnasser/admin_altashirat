<template>
  <div class="d-flex justify-center">
    <v-card
      class="card mb-6 w-100 w-sm-75 mt-4 mt-sm-7"
      v-if="formReady"
      :title="isEdit ? t('visas.edit_title') : t('visas.create_title')"
    >
      <Form @submit="handleSubmit" class="mt-6 mx-2 mx-sm-4" :initial-values="formData">
        <div class="mb-4">
          <Text
            id="visa-name"
            :label="t('fields.name')"
            name="name"
            rules="required"
            :api-error="fieldErrors?.name"
            :field-name="t('fields.name')"
            :hint="isEdit ? t('hints.visa-types.edit') : t('hints.visa-types.new')"
          />
        </div>

        <div class="mb-4">
          <Select
            name="visible"
            rules="required"
            :items="visibilityOptions"
            :hint="t('hints.visibility')"
          />
        </div>

        <!-- Locale selector for edit mode -->
        <div v-if="isEdit" class="mb-4">
          <LocaleSelector
            v-model="formLocale"
            :title="t('fields.locale')"
            :hint="t('hints.locale')"
            variant="outlined"
            :onLocaleSelected="handleLocaleSelector"
            :show-globe="true"
            :translation="true"
            :disabled="!formReady"
          />
        </div>

        <div class="d-flex flex-column flex-sm-row my-6" :class="{'justify-sm-end': true}">
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
import { useFormLocaleStore } from "@/stores/formLocale.js";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const { _get, _post, isLoading } = useApi();

const apiErrorStore = useApiErrorStore();
const { fieldErrors } = storeToRefs(apiErrorStore);

// Locale
const formLocaleStore = useFormLocaleStore();
const { setFormLocale } = formLocaleStore;
const { formLocale } = storeToRefs(formLocaleStore);

// Handle locale changes
const handleLocaleSelector = async (value) => {
  formReady.value = false;
  setFormLocale(value);

  try {
    if (isEdit.value && visaId.value) {
      const response = await _get(
        `/admin-panel/visa-types/${visaId.value}`,
        {}, // Empty params
        { "x-locale": value } // Custom headers
      );

      const visaData = response.data.visa_type;

      // Update form data with the localized version
      formData.value = {
        name: visaData.name || "",
        visible: visaData.visible ? "1" : "0",
      };
    }
  } catch (error) {
    console.error("Failed to fetch localized data:", error);
  } finally {
    formReady.value = true;
  }
};

// Check if we're in edit mode based on the route
const isEdit = computed(() => route.path.endsWith("/edit"));
const visaId = computed(() => route.params.id);

const visibilityOptions = computed(() => [
  { title: t("common.visible"), value: "1" },
  { title: t("common.hidden"), value: "0" },
]);

// Form data state with default values
const formData = ref({
  name: "",
  visible: "1",
});

// Used to control when the form is shown - important for edit mode
const formReady = ref(!isEdit.value);
const isSubmitting = ref(false);

const handleSubmit = async (values) => {
  isSubmitting.value = true;

  const submitData = new FormData();

  submitData.append("name", values.name);
  submitData.append("visible", values.visible);
  submitData.append("locale", formLocale.value);

  if (isEdit.value) {
    submitData.append("_method", "put");
  }

  try {
    let endpoint = "/admin-panel/visa-types";

    if (isEdit.value) {
      endpoint = `/admin-panel/visa-types/${visaId.value}`;
    }

    await _post(endpoint, submitData);

    eventBus.emit("visas-table:refresh");
    router.push("/visa-types");
  } catch (error) {
    throw error;
  } finally {
    isSubmitting.value = false;
  }
};

// Fetch data for edit mode
const fetchVisaData = async () => {
  if (!isEdit.value || !visaId.value) {
    formReady.value = true;
    return;
  }

  try {
    const response = await _get(
      `/admin-panel/visa-types/${visaId.value}`,
      {}, // Empty params
      { "x-locale": formLocale.value } // Send current locale in headers
    );

    const visaData = response.data.visa_type;

    // Set the form data all at once
    formData.value = {
      name: visaData.name || "",
      visible: visaData.visible ? "1" : "0",
    };

    // Set the locale if available
    if (visaData.locale) {
      setFormLocale(visaData.locale);
    }
  } catch (error) {
    throw error;
  } finally {
    // Mark the form as ready to be displayed
    formReady.value = true;
  }
};

const goBack = () => {
  router.push("/visa-types");
};

onMounted(async () => {
  if (isEdit.value) {
    await fetchVisaData();
  } else {
    formReady.value = true;
  }
});
</script>