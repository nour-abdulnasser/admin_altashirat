<template>
  <div>
    <label class="input__label" v-if="showLabel" :for="id">{{ label }}</label>

    <div v-if="title" class="input__label mb-1">
      {{ title }}
    </div>
    <v-date-input
      v-model="dateModel"
      prepend-icon=""
      prepend-inner-icon="$calendar"
      :error="!!errorMessage"
      :error-messages="errorMessage"
      :hint="hint"
      persistent-hint
      variant="outlined"
      rounded="md"
      :menu-props="{ contentClass: 'date-picker-menu' }"
      @blur="validateOnImmediate"
      @update:model-value="updateDate"
      open-on-click
    ></v-date-input>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate'
import { computed, ref, watch } from 'vue'
import { VDateInput } from 'vuetify/labs/VDateInput'



const props = defineProps({
  rules: {
    type: [Array, Function, String],
    default: () => []
  },
  hint: {
    type: String,
    default: ''
  },
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    default: ''
  },
  modelValue: {
    type: [String, Date, Number, null],
    default: null
  },
  showLabel: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { value, errorMessage, setTouched, validate } = useField(
  props.name,
  props.rules
)

// Parse the incoming string date to a Date object if needed
const parseDate = (dateValue) => {
  if (!dateValue) return null
  if (dateValue instanceof Date) return dateValue
  
  // Parse the date string (YYYY-MM-DD format)
  if (typeof dateValue === 'string') {
    try {
      return new Date(dateValue)
    } catch (e) {
      console.error('Invalid date format', e)
      return null
    }
  }
  return null
}

// Format Date object to YYYY-MM-DD string
const formatDate = (date) => {
  if (!date) return null
  if (typeof date === 'string' && date.match(/^\d{4}-\d{2}-\d{2}$/)) return date
  
  if (date instanceof Date) {
    const year = date.getFullYear()
    // getMonth() returns 0-11, so add 1
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  return null
}

// Store date internally as Date object for the component
const internalDate = ref(parseDate(props.modelValue))

// Watch for external changes to modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    internalDate.value = parseDate(newVal)
  },
  { immediate: true }
)

// Expose Date object to v-date-input
const dateModel = computed({
  get: () => internalDate.value,
  set: (newValue) => {
    internalDate.value = newValue
  }
})

// When the date picker updates, format as YYYY-MM-DD string for the parent
const updateDate = (newDate) => {
  const formattedDate = formatDate(newDate)
  value.value = formattedDate
  emit('update:modelValue', formattedDate)
}

const validateOnImmediate = () => {
  setTouched(true)
  validate()
}
</script>