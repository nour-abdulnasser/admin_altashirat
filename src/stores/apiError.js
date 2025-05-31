import { ref } from "vue";
import { defineStore } from "pinia";


export const useApiErrorStore = defineStore("api-errors", () => {
  // Error data comes in the form of {message, errors}.
  // I will take them separately from the BE response and fill the store respectively.
  const errorStatus = ref(null);
  const errorMessage = ref(null);
  const fieldErrors = ref(null); // object of arrays

  // Make setters rather than grab the refs in the code and change them.
  const setStatus = (statusCode) => {
    errorStatus.value = statusCode;
  };

  const setErrors = (errorResponse) => {
    errorMessage.value = errorResponse.message;
    fieldErrors.value = errorResponse.errors;
    
  };

  const clearErrors = () => {
    errorStatus.value = null;
    errorMessage.value = null;
    fieldErrors.value = null;
  };

  return {
    errorStatus,
    errorMessage,
    fieldErrors,
    setStatus,
    setErrors,
    clearErrors,
  };
});
