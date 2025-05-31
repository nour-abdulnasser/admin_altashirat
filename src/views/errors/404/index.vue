<template>
  <div class="d-flex flex-column justify-center align-center text-center error-page pa-4">
    <div class="w-100" style="max-width: 400px">
      <Image class="w-100" name="404" />
    </div>
    
    <v-card class="mt-4 mb-6 pa-4 error-card" variant="outlined" max-width="600px">
      <h1 class="text-h4 font-weight-bold mb-3 primary--text">
        {{ t("error.title") }}
      </h1>
      
      <p class="text-body-1 text-medium-emphasis mb-4">
        {{ t("error.desc") }}
      </p>
      
      <div class="d-flex justify-center">
        <Button 
          class="button--primary-filled py-2 px-6 text-capitalize" 
          :text="t('buttons.backToHome')" 
          @click="goToHome" 
        />
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n();
const router = useRouter();

const goToHome = () => {
  router.push('/'); 
};
</script>

