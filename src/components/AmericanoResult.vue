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
    </div>
  </div>
</template>

<script lang="ts">
import { PadelGame } from "@/models/padelGame.interface";
import { getPadelPlayers, prepareGames } from "../services/americanoService";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { defineComponent } from "vue";

const padelPlayers = getPadelPlayers();

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
      console.log(this.games);
    },
    getPlayerPlaceholder(index: number) {
      const playerNumber = Number(index) + 1;
      return "Spelare " + playerNumber;
    },
  },
});
</script>

<style>
</style>