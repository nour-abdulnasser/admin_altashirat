import { defineStore } from "pinia";
import { ref } from "vue";

export const useDrawerStore = defineStore("drawer", () => {
  const drawerState = ref(true);

  const toggleDrawer = () => {
    const prevState = drawerState.value;
    drawerState.value = !prevState;
  };

  return {
    drawerState,
    toggleDrawer,
  };
});
