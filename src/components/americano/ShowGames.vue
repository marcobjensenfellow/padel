<template>
  <div v-if="getGames.length > 0">
    <h3 class="text-center">Matcher</h3>
    <form @submit.prevent="onCalculateScore">
      <div class="form-group">
        <div v-for="(game, index) in getGames" :key="game.id">
          <div>
            <div v-if="IsNewRound(index)">Round: {{ game.round }}</div>
            <div>Game: {{ game.id }}</div>
            <div>
              <div>Home: {{ getPlayerNames(game, "home") }}</div>
              <input
                type="text"
                class="form-control"
                v-model="game.homeScore"
              />
            </div>
            <div>
              <div>Away: {{ getPlayerNames(game, "away") }}</div>
              <input
                type="text"
                class="form-control"
                v-model="game.awayScore"
              />
            </div>
          </div>
        </div>
        <button type="submit" class="btn btn-primary btn-block">
          Beräkna resultat
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store/index";
import { PadelGame } from "@/models/padelGame.interface";
import { getFullPlayerNames } from "@/services/htmlHelperService";

export default defineComponent({
  methods: {
    onCalculateScore(): void {
      console.log("calculate score");
      store.dispatch.americanoStore.updatePlayerScores();
    },
    IsNewRound(index: number) {
      return index % 2 == 0;
    },
    getPlayerNames(game: PadelGame, side: string) {
      return getFullPlayerNames(game, side);
    },
  },
  computed: {
    getGames() {
      return store.getters.americanoStore.getGames;
    },
  },
});
</script>

<style>
</style>