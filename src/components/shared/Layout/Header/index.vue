
<template>
  <div>
    <v-app-bar
      app
      class="navbar rounded-e-xl"
      :class="[
        { 'header--drawer-closed': !drawerState },
        { 'header--drawer-open': drawerState },
        { 'is-not-auth': !isAuth },
        { 'mobile': mobile },
        { 'not-mobile': !mobile },
        
        { 'border-s-sm is-not-auth ': !isAuth },
      ]"
      v-bind="$attrs"
      :elevation="0"
    >
      <template v-slot:prepend v-if="isAuth">
        <v-app-bar-nav-icon @click.stop="toggleDrawer()" class="drawer-icon">
          <Image icon="menu" :class="[{ 'w-75': xs, 'w-100': md }]" />
        </v-app-bar-nav-icon>
      </template>

      <template v-slot:append>
        <div class="d-flex align-center justify-space-around">
          <div
            class="profile__locale"
            :class="[
              {
                'border rounded-circle d-flex justify-center align-center hide-menu-icon':
                  mobile,
              },
            ]"
          >
            <LocaleSelector
              hide-details
              show-globe="true"
              class="locale-select--no-outline"
              v-model="appLocale"
              :show-flag-only="mobile ? true : false"
              :onLocaleSelected="handleLocaleSelector"
            />
          </div>
          <div
            class="auth__options d-flex pa-2 justify-space-between align-center"
            v-if="isAuth"
          >
            <div
              @click="goToEditProfile"
              style="cursor: pointer"
              class="navbar__profile d-flex pa-2 justify-space-between align-center"
            >
              <div>
                <v-avatar
                  color="surface-variant"
                  class="me-2"
                  v-if="userProfile.image"
                >
                  <Image :url="user.image.path" class="w-100 h-100" />
                </v-avatar>
                <v-avatar
                  :size="mobile ? 40 : 45"
                  color="surface-variant"
                  class="me-3"
                  v-else
                >
                  <v-icon class="mdi mdi-account"></v-icon>
                </v-avatar>
              </div>

              <div v-if="!mobile">
                <p>
                  {{ userProfile.firstname }}
                  {{ userProfile.lastname }}
                </p>
                <p v-if="userRoles?.length">
                  {{ userRoles[0].name }}
                </p>
                <p v-else>{{ t("navbar.user") }}</p>
              </div>

              <div v-if="mobile" :class="[{ 'append-details': mobile }]">
                <p>
                  {{ userProfile.firstname }}
                  {{ userProfile.lastname }}
                </p>
                <p v-if="userRoles?.length">
                  {{ userRoles[0].name }}
                </p>
                <p v-else>{{ t("navbar.user") }}</p>
              </div>
            </div>
            <div class="navbar__action ps-3 border-e-md">
              <v-btn
                size="30"
                @click="handleLogout"
                class="bg-error-light px-0 d-flex justify-center align-center me-3 rounded-sm"
              >
                <Image icon="exit" alt="" />
              </v-btn>
            </div>
            <!-- <v-divider vertical></v-divider> -->
            <div class="navbar__action ps-3">
              <div
                class="bg-primary-lighter pa-1 d-flex justify-center align-center me-3 rounded-sm"
              >
                <img src="@/assets/icons/gear.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </v-app-bar>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useDisplay } from "vuetify";

import { useApi } from "@/composables/useApi";

import { useDrawerStore } from "@/stores/drawer.js";
import { useAppLocaleStore } from "@/stores/appLocale";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const { mobile, mdAndUp, xs, sm, md } = useDisplay();
const { t } = useI18n();
const { _delete } = useApi();

const authStore = useAuthStore();
const { setAuthToken } = authStore;
const { isAuth, userProfile, userRoles } = storeToRefs(authStore);

const drawerStore = useDrawerStore();
const { toggleDrawer } = drawerStore;
const { drawerState } = storeToRefs(drawerStore);

const appLocaleStore = useAppLocaleStore();
const { setAppLocale } = appLocaleStore;
const { appLocale } = storeToRefs(appLocaleStore);

const goToEditProfile = () => {
  router.push("/profile");
};

const handleLocaleSelector = (value) => {
  setAppLocale(value);
  window.location.reload();
};
const handleLogout = async () => {
  try {
    await _delete("/logout");
    setAuthToken();
    router.push("/");
    window.location.reload();
  } catch (err) {
    throw err;
  }
};
</script>

