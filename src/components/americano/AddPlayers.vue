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
        <button class="btn btn-pdl">
          {{ getAddPlayerText }} <i class="las la-arrow-right"></i>
        </button>
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
      const isGamePrepared = store.getters.americanoStore.getIsGamePrepared;

      if (!isGamePrepared) {
        store.dispatch.americanoStore.prepareGames();
      }
      store.commit.americanoStore.INCREMENT_STEP();
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
    getAddPlayerText() {
      const isGamePrepared = store.getters.americanoStore.getIsGamePrepared;

      if (isGamePrepared) {
        return "Gå till matcher";
      }

      return "Lägg till spelare";
    },
  },
});
</script>

<style>
</style>