<template>
  <v-btn v-bind="$attrs" :class="$attrs.class" :text="t(`buttons.${buttonText}`)" > </v-btn>
</template>

<script setup>
import { defineProps } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const props = defineProps({
  buttonText: String,
});
</script>
