<template>
  <div class="d-flex justify-center">
    <v-card
      class="card mb-6 w-100 w-sm-75"
      v-if="formReady"
      :title="isEdit ? t('titles.edit_title') : t('titles.create_title')"
    >
      <Form @submit="handleSubmit" class="mt-6 mx-4" :initial-values="formData">
        <div class="mb-4">
          <Text
            id="title-name"
            :label="t('titles.fields.name')"
            name="name"
            rules="required"
            :api-error="fieldErrors?.name"
            :hint="isEdit ? t('hints.titles.edit') : t('hints.titles.new')"
            :field-name="t('titles.fields.name')"
          />
        </div>

        <div class="mb-4">
          <Select
            name="visible"
           
            :hint="t('hints.visibility')"
            rules="required"
            :items="visibilityOptions"
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
import { storeToRefs } from "pinia";

import { useApi } from "@/composables/useApi";
import eventBus from "@/utils/eventBus";

import { useApiErrorStore } from "@/stores/apiError";
import { useFormLocaleStore } from "@/stores/formLocale.js";

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

// Api
const { _get, _post, isLoading } = useApi();

// Error store
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
    if (isEdit.value && titleId.value) {
      const response = await _get(
        `/admin-panel/titles/${titleId.value}`,
        {}, // Empty params
        { "x-locale": value } // Custom headers
      );

      const titleData = response.data.title;

      // Update form data with the localized version
      formData.value = {
        name: titleData.name || "",
        visible: titleData.visible ? "1" : "0",
      };
    }
  } catch (error) {
    console.error("Failed to fetch localized data:", error);
  } finally {
    formReady.value = true;
  }
};

// Task: Watch params make isEdit and show locale selector and update method
const isEdit = computed(() => route.path.endsWith("/edit"));
const titleId = computed(() => route.params.id);

const visibilityOptions = computed(() => [
  { title: t("common.visible"), value: "1" },
  { title: t("common.hidden"), value: "0" },
]);

// Form data state with default values - this will be passed to Form's initial-values
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

  // Task: Watch params make isEdit and show locale selector and update method
  if (isEdit.value) {
    submitData.append("_method", "put");
  }

  try {
    let endpoint = "/admin-panel/titles";

    if (isEdit.value) {
      endpoint = `/admin-panel/titles/${titleId.value}`;
    }

    const response = await _post(endpoint, submitData);

    eventBus.emit("titles-table:reload");
    // TODO: Handle reload time some other way
    router.push({
      path: "/titles",
    });
  } catch (error) {
    throw error;
  } finally {
    isSubmitting.value = false;
  }
};

// Fetch data for edit mode
const fetchTitleData = async () => {
  if (!isEdit.value || !titleId.value) {
    formReady.value = true;
    return;
  }

  try {
    const response = await _get(
      `/admin-panel/titles/${titleId.value}`,
      {}, // Empty params
      { "x-locale": formLocale.value } // Send current locale in headers
    );

    const titleData = response.data.title;

    // Set the form data all at once
    formData.value = {
      name: titleData.name || "",
      visible: titleData.visible ? "1" : "0",
    };

    // Set the locale if available
    if (titleData.locale) {
      setFormLocale(titleData.locale);
    }
  } catch (error) {
    throw error;
  } finally {
    // Mark the form as ready to be displayed
    formReady.value = true;
  }
};

const goBack = () => {
  router.push("/titles");
};

onMounted(async () => {
  if (isEdit.value) {
    await fetchTitleData();
  } else {
    formReady.value = true;
  }
});
</script>