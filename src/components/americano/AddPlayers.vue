<template>
  <div>
    <h3 class="text-center">Lägg till spelare</h3>
    <form @submit.prevent="onAddPlayers">
      <label>Namn</label>
      <div
        v-for="(player, index) in getPlayers"
        :key="player.id"
        class="form-group"
      >
        <input
          type="text"
          class="form-control"
          :placeholder="getPlayerPlaceholder(index)"
          v-model="player.name"
          required
        />
      </div>

      <div class="form-group">
        <button class="btn btn-primary btn-block">Lägg till spelare</button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    onAddPlayers(): void {
      store.dispatch.americanoStore.prepareGames();
    },
    getPlayerPlaceholder(index: number) {
      const playerNumber = Number(index) + 1;
      return "Spelare " + playerNumber;
    },
  },
  computed: {
    getPlayers() {
      return store.getters.americanoStore.getPlayers;
    },
  },
});
</script>

<style>
</style>