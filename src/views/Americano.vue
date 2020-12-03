<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <!-- ADD PLAYERS  -->
      <AddPlayers></AddPlayers>

      <!-- SHOW GAMES -->
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