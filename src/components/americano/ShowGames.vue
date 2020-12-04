<template>
  <div v-if="getGames.length > 0">
    <h3 class="text-center">Matcher</h3>
    <form @submit.prevent="onCalculateScore">
      <div class="form-group">
        <div class="score-container">
          <div v-for="(game, index) in getGames" :key="game.id">
            <div v-if="IsNewRound(index)" class="score-round">
              Omgång: {{ game.round }}
            </div>
            <div
              class="game-container"
              :class="{ 'second-match': isSecondGame(game) }"
            >
              <table>
                <tbody>
                  <tr>
                    <td class="team-element">
                      {{ getPlayerNames(game, "home") }}
                    </td>
                    <td>
                      <input v-model="game.homeScore" class="input-element" />
                    </td>
                    <td>VS</td>
                    <td>
                      <input v-model="game.awayScore" class="input-element" />
                    </td>
                    <td class="team-element">
                      {{ getPlayerNames(game, "away") }}
                    </td>
                  </tr>
                </tbody>
              </table>
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
      store.commit.americanoStore.INCREMENT_STEP();
    },
    IsNewRound(index: number) {
      return index % 2 === 0;
    },
    getPlayerNames(game: PadelGame, side: string) {
      return getFullPlayerNames(game, side);
    },
    isSecondGame(game: PadelGame) {
      return game.matchNumber === 2;
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
.score-container {
  border-radius: 0.375rem;
  background-color: lightblue;
  overflow: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.score-round {
  background-color: #34495e;
  text-align: left;
  color: white;
  padding: 0.4rem;
}

.game-container {
  background-color: #ecf0f1;
  padding: 0.2rem;
}

.input-element {
  width: 35px;
  text-align: center;
}

.team-element {
  width: 200px;
}

.second-match {
  border-top: 0.1rem solid #2c3e50;
}
</style>