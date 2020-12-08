<template>
  <div>
    <h1 class="text-center">Förberedelser</h1>
    <form @submit.prevent="onAddPlayers">
      <div class="row">
        <div class="col-6">
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
              @keyup="handlePlayerNameChange()"
              :class="{
                'is-invalid': isDuplicateName(player.id),
                'is-second': isSecondGroup(player),
                'is-first': isFirstGroup(player),
              }"
              required
            />
            <small
              id="duplicateNameHelp"
              class="form-text text-danger"
              v-if="isDuplicateName(player.id)"
            >
              Namnet används redan
            </small>
          </div>
        </div>
        <div class="col-6">
          <h4>Regler</h4>
          <div>
            <div class="form-group">
              <label class="form-check-label" for="amountOfPlayers">
                Antal spelare
              </label>
              <select
                class="form-control"
                id="amountOfPlayers"
                v-model="amountOfPlayers"
                @change="handleAmountOfPlayersChange"
                :disabled="getIsGamePrepared"
              >
                <option value="8">8</option>
                <option value="16">16</option>
              </select>
            </div>
            <div class="form-group">
              <label for="maxScoreInput" class="form-label"
                >Maxpoäng per runda</label
              >
              <input
                type="text"
                id="maxScoreInput"
                class="form-control"
                :class="{ 'is-invalid': maxScoreInvalid }"
                v-model="maxScore"
                @focusout="onMaxScoreChange"
                required
              />
              <small
                v-if="maxScoreInvalid"
                id="maxScoreInvalidHelp"
                class="text-danger"
              >
                Måste vara en eller flera siffror.
              </small>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="randomScheduleRule"
                  id="randomScheduleCheck"
                  :disabled="getIsGamePrepared"
                />
                <label class="form-check-label" for="randomScheduleCheck">
                  Slumpa spelschema
                </label>
                <small id="randomScheduleHelp" class="form-text text-muted">
                  Slumpa spelschema innebär en ny matchlottning trots att det är
                  samma deltagare.
                </small>
              </div>
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="colorCode"
                  id="colorCodeCheck"
                />
                <label class="form-check-label" for="randomScheduleCheck">
                  Färgmarkera grupper
                </label>
                <small id="randomScheduleHelp" class="form-text text-muted">
                  Färgmarkera de två grupperna så att det blir tydligt vilka som
                  hör ihop.
                </small>
              </div>
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
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { PadelRules } from "@/models/padelRules.interface";
import { getPadelPlayers } from "@/services/americanoService";
import { getDuplicateIds, isValidMaxScore } from "@/services/htmlHelperService";
import store from "@/store/index";
import { defineComponent } from "vue";

export default defineComponent({
  data: function () {
    return {
      maxScore: 32,
      maxScoreInvalid: false,
      duplicateNameIds: [] as number[],
      amountOfPlayers: 8,
      colorCode: false,
    };
  },
  methods: {
    onAddPlayers(): void {
      if (this.maxScoreInvalid) {
        return;
      }

      const duplicateIds = getDuplicateIds(this.getPlayers);

      if (duplicateIds.length > 0) {
        this.$data.duplicateNameIds = duplicateIds;
        return;
      }

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
      this.$data.duplicateNameIds = [];
      this.$data.maxScoreInvalid = false;
      this.$data.maxScore = 32;
    },
    onMaxScoreChange() {
      const value = this.$data.maxScore;

      if (!isValidMaxScore(value)) {
        this.maxScoreInvalid = true;
        return;
      }

      this.maxScoreInvalid = false;

      const numberValue = Number(value);
      const newRules: PadelRules = {
        ...store.getters.americanoStore.getRules,
        maxScore: numberValue,
      };
      store.commit.americanoStore.SET_RULES(newRules);
    },
    handlePlayerNameChange() {
      this.$data.duplicateNameIds = getDuplicateIds(this.getPlayers);
    },
    handleAmountOfPlayersChange() {
      const players = getPadelPlayers(this.$data.amountOfPlayers);
      store.commit.americanoStore.UPDATE_PLAYERS(players);
    },
    isDuplicateName(id: number) {
      return this.$data.duplicateNameIds.includes(id);
    },
    isSecondGroup(player: PadelPlayer) {
      if (this.amountOfPlayers === 8 || this.$data.colorCode === false) {
        return false;
      }
      const allPlayers = store.getters.americanoStore.getPlayers;

      const index = allPlayers.indexOf(player);

      return index > 7;
    },

    isFirstGroup(player: PadelPlayer) {
      if (this.amountOfPlayers === 8 || this.$data.colorCode === false) {
        return false;
      }
      const allPlayers = store.getters.americanoStore.getPlayers;

      const index = allPlayers.indexOf(player);

      return index <= 7;
    },
  },
  created() {
    this.$data.maxScore = store.getters.americanoStore.getRules.maxScore;
    this.$data.amountOfPlayers =
      store.getters.americanoStore.getRules.amountOfPlayers;
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
    randomScheduleRule: {
      get() {
        return store.getters.americanoStore.getRules.randomSchedule;
      },
      set(value: boolean) {
        const newRules: PadelRules = {
          ...store.getters.americanoStore.getRules,
          randomSchedule: value,
        };
        store.commit.americanoStore.SET_RULES(newRules);
      },
    },
    getIsGamePrepared() {
      return store.getters.americanoStore.getIsGamePrepared;
    },
  },
});
</script>

<style>
.is-second {
  background-color: #f0fbfc;
}

.is-first {
  background-color: #fcf0f0;
}
</style>