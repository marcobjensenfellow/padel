<template>
  <div class="row justify-content-center">
    <div class="col-md-5">
      <!-- ADD PLAYERS  -->
      <h3 class="text-center">Lägg till spelare</h3>
      <form @submit.prevent="onAddPlayers">
        <label>Namn</label>
        <div
          v-for="(player, index) in players"
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
      <div v-if="games.length > 0">
        <h3 class="text-center">Matcher</h3>
        <form @submit.prevent="onCalculateScore">
          <div class="form-group">
            <div v-for="(game, index) in games" :key="game.id">
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
import { getPadelPlayers, prepareGames } from "../services/americanoService";
import { getFullPlayerNames } from "../services/htmlHelperService";
import { updatePlayerScores } from "../services/scoreService";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      players: getPadelPlayers(),
      games: [] as PadelGame[],
    };
  },
  methods: {
    onAddPlayers(): void {
      this.games = prepareGames(this.players);
    },
    onCalculateScore(): void {
      console.log("calculate score");
      this.players = updatePlayerScores(this.players, this.games);
      console.log(this.players);
    },
    getPlayerPlaceholder(index: number) {
      const playerNumber = Number(index) + 1;
      return "Spelare " + playerNumber;
    },
    IsNewRound(index: number) {
      return index % 2 == 0;
    },
    getPlayerNames(game: PadelGame, side: string) {
      return getFullPlayerNames(this.players, game, side);
    },
  },
});
</script>

<style>
</style>