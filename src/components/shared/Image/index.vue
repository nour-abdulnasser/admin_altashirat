<template>
  <div class="d-flex justify-center align-center">
    <img v-if="source" v-bind="$attrs" :src="source" />
  </div>
</template>
    
  <script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
  url: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  src: {
    //For fallback
    type: String,
    default: "",
  },
});

const source = ref("");

onMounted(async () => {
  if (props.name && props.name.length) {
    try {
      const imageModule = await import(`@/assets/images/${props.name}.png`);
      source.value = imageModule.default;
    } catch (e) {
      throw e;
    }
  } else if (props.icon && props.icon.length) {
    try {
      const imageModule = await import(`@/assets/icons/${props.icon}.svg`);
      source.value = imageModule.default;
    } catch (e) {
      throw e;
    }
  } else if (props.url && props.url.length) {
    source.value = props.url;
  } else {
    source.value = props.src;
  }
});
</script>