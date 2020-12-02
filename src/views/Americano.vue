<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <!-- ADD PLAYERS  -->
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

      <!-- SHOW GAMES -->
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
    </div>
  </div>
</template>

<script lang="ts">
import { PadelGame } from "@/models/padelGame.interface";
import { getFullPlayerNames } from "../services/htmlHelperService";
import { updatePlayerScores } from "../services/scoreService";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { defineComponent } from "vue";
import store from "@/store/index";

export default defineComponent({
  data() {
    return {};
  },
  methods: {
    onAddPlayers(): void {
      store.dispatch.americanoStore.prepareGames();
    },
    onCalculateScore(): void {
      console.log("calculate score");
      store.dispatch.americanoStore.updatePlayerScores();
      console.log(this.getPlayers);
    },
    getPlayerPlaceholder(index: number) {
      const playerNumber = Number(index) + 1;
      return "Spelare " + playerNumber;
    },
    IsNewRound(index: number) {
      return index % 2 == 0;
    },
    getPlayerNames(game: PadelGame, side: string) {
      return getFullPlayerNames(game, side);
    },
  },
  computed: {
    getPlayers() {
      return store.getters.americanoStore.getPlayers;
    },
    getGames() {
      return store.getters.americanoStore.getGames;
    },
  },
});
</script>

<style>
</style>