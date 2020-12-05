<template>
  <div>
    <h1 class="text-center">Förberedelser</h1>
    <form @submit.prevent="onAddPlayers">
      <div class="d-flex flex-row justify-content-between">
        <div>
          <h4>Lägg till spelare</h4>
          <div
            v-for="(player, index) in getPlayers"
            :key="player.id"
            class="form-group"
          >
            <input
              type="text"
              class="form-control mx-auto"
              :placeholder="getPlayerPlaceholder(index)"
              v-model="player.name"
              required
            />
          </div>
        </div>
        <div>
          <h4>Regler</h4>
          <div>
            <div class="form-group">
              <label for="maxScoreInput">Maxpoäng per runda</label>
              <input
                type="text"
                id="maxScoreInput"
                class="form-control mx-auto"
                v-model="getMaxScore"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div class="form-group">
        <button type="button" @click="reset" class="btn btn-pdl mr-3">
          <i class="las la-times"></i> Börja om
        </button>
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
    reset() {
      store.commit.americanoStore.RESET();
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
    getMaxScore() {
      return store.getters.americanoStore.getMaxScore;
    },
  },
});
</script>

<style>
</style>