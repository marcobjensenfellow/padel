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
              <div class="d-flex flex-row justify-content-between">
                <div class="team-element p-2">
                  <span class="team">{{ getPlayerNames(game, "home") }}</span>
                  vs
                  <span class="team">{{ getPlayerNames(game, "away") }}</span>
                </div>

                <div class="team-element p-2 align-self-center">
                  <input v-model="game.homeScore" class="input-element" />
                  VS
                  <input v-model="game.awayScore" class="input-element" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <div class="float-left">
            <button @click="goBack" class="btn btn-pdl mt-3">
              <i class="las la-arrow-left"></i> Ändra lag
            </button>
          </div>
          <div class="float-right">
            <button type="submit" class="btn btn-pdl mt-3">
              Beräkna resultat <i class="las la-arrow-right"></i>
            </button>
          </div>
        </div>
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
    goBack(): void {
      store.commit.americanoStore.DECREMENT_STEP();
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
/* FIX BOOTSTRAP  */
.table {
  margin-bottom: 0;
}

/* FIX BOOTSTRAP  */
.table td {
  padding: 0;
  vertical-align: baseline;
}

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
  background-color: white;
  padding: 0.2rem;
}

.team {
  font-weight: bold;
}

.vs-element {
  width: 150px;
}

.input-element {
  width: 35px;
  text-align: center;
}

.second-match {
  border-top: 0.1rem solid #2c3e50;
}

.btn-pdl {
  color: #fff;
  background-color: #34495e;
  border-color: #34495e;
}
</style>