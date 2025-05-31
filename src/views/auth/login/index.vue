<template>
  <div
    v-if="!isAuth"
    class="login d-flex justify-center align-center position-relative fill-height"
  >
    <v-container>
      <div class="login-content position-absolute">
        <v-card class="card" :title="t('forms.login.title')">
          <v-container>
            <Form
              @submit="handleSubmit"
              :initial-values="initialFormData"
              class="pa-5"
            >
              <Phone
                :apiError="fieldErrors?.phone"
                name="phone"
                :countryRules="'required'"
                :numberRules="'required'"
                :label="t('fields.phone.number')"
                v-model="phoneData"
              />
              <Password
                :apiError="fieldErrors?.password"
                name="password"
                :hint="$t('hints.loginPassword')"
                class="mt-3"
                rules="required|min:8|max:50"
                :label="$t('fields.password')"
                id="loginPassword"
              />
              <div class="w-100 d-flex justify-end">
                <Button
                  type="submit"
                  :loading="isLoading"
                  class="elevation-0 button--secondary-filled font-weight-bold mt-4"
                  :text="t('buttons.login')"
                />
              </div>
            </Form>
          </v-container>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { Form } from "vee-validate";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

import { useApi } from "@/composables/useApi";

import { useAuthStore } from "@/stores/auth";
import { useAppLocaleStore } from "@/stores/appLocale";
import { useApiErrorStore } from "@/stores/apiError";

const { t } = useI18n();

const { locale } = useI18n();
const router = useRouter();
const route = useRoute();
const api = useApi();

const authStore = useAuthStore();
const { isAuth } = storeToRefs(authStore);
const { fetchUserProfile, setAuthToken } = authStore;

const appLocaleStore = useAppLocaleStore();
const { appLocale } = storeToRefs(appLocaleStore);

const apiErrorStore = useApiErrorStore();
const { fieldErrors } = storeToRefs(apiErrorStore);

const isLoading = ref(false);
const defaultCountryCode = appLocale.value === "ar" ? "0020" : "0044";
const phoneData = ref({ country_code: defaultCountryCode, number: "" });
const initialFormData = computed(() => ({
  phone: phoneData.value,
  password: "",
}));

const handleSubmit = async (values) => {
  isLoading.value = true;
  const formData = new FormData();
  formData.append("phone[number]", values.phone.number);
  formData.append("phone[country_code]", values.phone.country_code);
  formData.append("password", values.password);

  try {
    const response = await api._post("/login", formData);
    setAuthToken(response.data.token);
    await fetchUserProfile();
    const redirectPath = route.query.redirect || "/users";
    await router.push(redirectPath);
  } catch (err) {
    throw err;
  } finally {
    isLoading.value = false;
  }
};
</script>
