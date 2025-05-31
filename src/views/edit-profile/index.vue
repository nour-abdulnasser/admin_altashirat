<template>
  <v-container fluid class="pa-0">
    <v-row no-gutters justify="center">
      <v-col cols="12" class="pa-2 pa-sm-4">
        <v-card class="card mb-6" :title="t('editProfile.title')">
          <div v-if="!formReady" class="d-flex justify-center align-center py-12">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
          </div>
          
          <Form
            v-else
            ref="formRef"
            @submit="updateProfile"
            :initial-values="formInitialValues"
            class="my-6 mx-4"
          >
            <!-- All form fields in vertical layout -->
            <div class="mb-4">
              <Text
                id="firstname"
                name="firstname"
                rules="required|min:3|max:15"
                :apiError="fieldErrors?.firstname?.[0]"
                :label="$t('labels.firstname')"
                :hint="$t('hints.firstname')"
                class="w-100"

              />
            </div>
            
            <div class="mb-4">
              <Text
                id="middlename"
                name="middlename"
                rules="max:15"
                :apiError="fieldErrors?.middlename?.[0]"
                :label="$t('labels.middlename')"
                :hint="$t('hints.middlename')"
                outlined
                dense
                class="w-100"
              />
            </div>
            
            <div class="mb-4">
              <Text
                id="lastname"
                name="lastname"
                rules="required|min:3|max:15"
                :apiError="fieldErrors?.lastname?.[0]"
                :label="$t('labels.lastname')"
                :hint="$t('hints.lastname')"
                outlined
                dense
                class="w-100"
              />
            </div>
            
            <div class="mb-4">
              <Text
                id="email"
                name="email"
                rules="required|email|max:50"
                :apiError="fieldErrors?.email?.[0]"
                :label="$t('labels.email')"
                :hint="$t('hints.email')"
                outlined
                dense
                class="w-100"
              />
            </div>
            
            <div class="mb-4">
              <Countries
                name="country"
                rules="required"
                :label="$t('labels.country')"
                :hint="$t('hints.country')"
                :apiError="fieldErrors?.country_id"
                customClass="w-100"
                displayMode="name"
               
                outlined
                :show-label="true"
                class="w-100"
              />
            </div>
            
            <div class="mb-4">
              <Phone
                name="phone"
                :label="$t('labels.phone')"
                :country-rules="'required'"
                :number-rules="'required|numeric|min:9|max:15'"
                outlined
                dense
                class="w-100"
              />
            </div>
            
            <div class="mb-4">
              <DateInput
                name="birthdate"
                rules="required"
                :label="$t('labels.birthdate')"
                :modelValue="formInitialValues.birthdate"
                @update:modelValue="updateBirthdate"
                :hint="$t('hints.birthdate')"
                :title="$t('fields.birthdate')"
                
                class="date-input-wrapper w-100"
                outlined
                dense
              />
            </div>
            
            <!-- Submit Button -->
            <div class="w-100 d-flex justify-end">
              <Button
                type="submit"
                class=" elevation-0 button--secondary-filled py-4 px-8   font-weight-bold rounded-md"
                :loading="isLoading"
                :text="$t('buttons.save')"
              />
            </div>
          </Form>
        </v-card>
      </v-col>

      <!-- Edit Password Card -->
      <v-col cols="12" class="pa-2 pa-sm-4">
        <v-card class="card mb-6" :title="t('titles.changePassword')">
          <Form @submit="savePassword" class="full-width-form my-6 mx-4">
            <!-- Password fields - full width -->
            <div class="w-100 mb-4">
              <Password
                id="currentPassword"
                name="old_password"
                rounded="xl"
                :apiError="fieldErrors?.old_password"
                :label="$t('changePassword.labels.currentPassword')"
                :hint="$t('hints.currentPassword')"
                rules="required|min:8|max:50"
                class="w-100"
              />
            </div>

            <div class="w-100 mb-4">
              <Password
                id="newPassword"
                rounded="xl"
                name="new_password"
                :apiError="fieldErrors?.new_password"
                :label="$t('changePassword.labels.newPassword')"
                :hint="$t('hints.newPassword')"
                rules="required|min:8|max:50"
                class="w-100"
              />
            </div>

            <div class="w-100 mb-4">
              <Password
                id="confirmPassword"
                rounded="xl"
                :apiError="fieldErrors?.new_password_confirmation"
                name="new_password_confirmation"
                :label="$t('changePassword.labels.confirmPassword')"
                :hint="$t('hints.confirmPassword')"
                rules="required|min:8|max:50"
                class="w-100"
              />
            </div>

            <div class="w-100 d-flex justify-end">
              <Button
                type="submit"
                class=" elevation-0 button--secondary-filled py-4 px-8   font-weight-bold rounded-md"

                :loading="isLoading"
                :text="$t('buttons.save')"
              />
            </div>
          </Form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { Form } from "vee-validate";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
import { useApi } from "@/composables/useApi";
import { useAuthStore } from "@/stores/auth";
import { useApiErrorStore } from "@/stores/apiError";

const { _post, isLoading } = useApi();

const { t } = useI18n();
const authStore = useAuthStore();
const { userProfile } = storeToRefs(authStore);
const { fetchUserProfile } = authStore;

const apiErrorStore = useApiErrorStore();
const { fieldErrors } = storeToRefs(apiErrorStore);

const updateBirthdate = (newValue) => {
  formInitialValues.value.birthdate = newValue; // Update the reactive formInitialValues
};

// Form state management
const formReady = ref(false);
const formRef = ref(null);

// Simple computed property for form initial values
const formInitialValues = computed(() => {
  const profile = userProfile.value || {};

  return {
    firstname: profile.firstname || "",
    middlename: profile.middlename || "",
    lastname: profile.lastname || "",
    email: profile.email || "",
    birthdate: profile.birthdate || "",
    phone: {
      number: profile.phone?.number || "",
      country_code: profile.phone?.country_code || "",
    },
    country:
      typeof profile.country === "object"
        ? profile.country?.id || profile.country?.value || ""
        : profile.country || "",
  };
});

// Update profile handler
const updateProfile = async (values) => {
  const formData = new FormData();
  formData.append("firstname", values.firstname);
  formData.append("middlename", values.middlename || "");
  formData.append("lastname", values.lastname);
  formData.append("email", values.email);
  formData.append("birthdate", values.birthdate || "");
  formData.append("phone[number]", values.phone.number);
  formData.append("phone[country_code]", values.phone.country_code);

  const countryValue =
    typeof values.country === "object"
      ? values.country?.id || values.country?.value || ""
      : values.country || "";
  formData.append("country", countryValue);

  try {
    await _post("/update-account", formData);
    await fetchUserProfile();
  } catch (err) {
    throw err;
  }
};

// Password change handler
const savePassword = async (values) => {
  try {
    await _post("/change-password", {
      old_password: values.old_password,
      new_password: values.new_password,
      new_password_confirmation: values.new_password_confirmation,
    });
  } catch (err) {
    throw err;
  }
};

// Load user profile on mount
onMounted(async () => {
  try {
    await fetchUserProfile();
    formReady.value = true;
  } catch (error) {
    throw error;
  }
});

// Clear errors when component unmounts
onBeforeUnmount(() => {
  if (apiErrorStore.clearErrors) {
    apiErrorStore.clearErrors();
  }
});
</script>

 