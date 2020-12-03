<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <AddPlayers></AddPlayers>
      <ShowGames></ShowGames>
    </div>
  </div>
</template>

<script lang="ts">
import AddPlayers from "@/components/americano/AddPlayers.vue";
import ShowGames from "@/components/americano/ShowGames.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    AddPlayers,
    ShowGames,
  },
});
</script>

<style>
</style>