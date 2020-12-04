<template>
  <div style="max-width: 80rem">
    <div class="row justify-content-center">
      <div class="col-8 col-sm-5 col-md-4 col-lg-5">
        <AddPlayers v-if="getStep === 1"></AddPlayers>
        <ShowGames v-if="getStep === 2"></ShowGames>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import AddPlayers from "@/components/americano/AddPlayers.vue";
import ShowGames from "@/components/americano/ShowGames.vue";
import { defineComponent } from "vue";
import store from "@/store/index";

export default defineComponent({
  components: {
    AddPlayers,
    ShowGames,
  },
  computed: {
    getStep(): number {
      return store.getters.americanoStore.getStep;
    },
  },
});
</script>

<style>
</style>