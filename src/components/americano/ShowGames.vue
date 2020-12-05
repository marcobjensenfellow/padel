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
                  <span class="team">{{ getPlayerNames(game, 1) }}</span>
                  <span class="vs"> vs </span>
                  <span class="team">{{ getPlayerNames(game, 2) }}</span>
                </div>

                <div class="team-element p-2 align-self-center">
                  <input
                    v-model="game.homeScore"
                    class="input-element"
                    required
                    @focusout="handleFocusChange(game, 1)"
                  />
                  -
                  <input
                    v-model="game.awayScore"
                    class="input-element"
                    required
                    @focusout="handleFocusChange(game, 2)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="clearfix">
          <div class="float-left">
            <button type="button" @click="goBack" class="btn btn-pdl mt-3">
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
import { evenScore, removeNotNumbers } from "@/services/scoreService";
import { GameSide } from "@/models/gameSide.enum";

export default defineComponent({
  methods: {
    onCalculateScore(): void {
      store.dispatch.americanoStore.updatePlayerScores();
      store.commit.americanoStore.INCREMENT_STEP();
    },
    IsNewRound(index: number) {
      return index % 2 === 0;
    },
    getPlayerNames(game: PadelGame, side: GameSide) {
      return getFullPlayerNames(game, side);
    },
    isSecondGame(game: PadelGame) {
      return game.matchNumber === 2;
    },
    goBack(): void {
      store.dispatch.americanoStore.sortPlayersById();
      store.commit.americanoStore.DECREMENT_STEP();
    },
    handleFocusChange(game: PadelGame, side: GameSide) {
      removeNotNumbers(game, side, store.getters.americanoStore.getMaxScore);
      evenScore(game, store.getters.americanoStore.getMaxScore, side);
      store.dispatch.americanoStore.saveStateManually();
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
  overflow: auto;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

.score-round {
  background-color: var(--main-gray);
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
  color: var(--main-gray);
}

.vs {
  color: #e74c3c;
}

.vs-element {
  width: 150px;
}

.input-element {
  width: 35px;
  text-align: center;
}

.second-match {
  border-top: 0.1rem solid var(--main-gray);
}

.btn-pdl {
  color: #fff;
  background-color: var(--main-gray);
  border-color: var(--main-gray);
}
</style>