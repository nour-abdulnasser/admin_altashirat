<template>
  <div>
    <span
      :class="[
        'input__message',
        'ms-auto',
        { 'input__message--valid': props.isValid },
        { 'input__message--invalid': !props.isValid },
      ]"
    >
      {{ props.validationMessage }}
      <Image v-if="props.isValid" icon="valid" />
      <Image v-if="!props.isValid" icon="invalid" />
      <!-- <img v-if="props.isValid" src="@/assets/icons/valid.svg" alt="" />
      <img v-if="!props.isValid" src="@/assets/icons/invalid.svg" alt="" /> -->
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  id: {
    type: [String, Number],
    required: false,
  },
  isValid: Boolean,
  validationMessage: String,
});
</script>