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
              required
            />
          </div>
        </div>
        <div class="col-6">
          <h4>Regler</h4>
          <div>
            <div class="form-group">
              <label for="maxScoreInput" class="form-label"
                >Maxpoäng per runda</label
              >
              <input
                type="text"
                id="maxScoreInput"
                class="form-control mx-auto"
                v-model="maxScoreRule"
                required
              />
            </div>
            <div class="form-group">
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="checkbox"
                  v-model="randomScheduleRule"
                  id="randomScheduleCheck"
                />
                <label class="form-check-label" for="randomScheduleCheck">
                  Slumpa spelschema
                </label>
                <small id="randomScheduleHelp" class="form-text text-muted">
                  Slumpat spelschema innebär att du ej kan återskapa exakt samma
                  spelschema eftersom att spelordningen slumpas.
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
import { PadelRules } from "@/models/padelRules.interface";
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
    maxScoreRule: {
      get() {
        return store.getters.americanoStore.getRules.maxScore;
      },
      set(value: number) {
        // TODO: add check to see if valid number
        const numberValue = Number(value);
        const newRules: PadelRules = {
          ...store.getters.americanoStore.getRules,
          maxScore: numberValue,
        };
        store.commit.americanoStore.SET_RULES(newRules);
      },
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
  },
});
</script>

<style>
</style>