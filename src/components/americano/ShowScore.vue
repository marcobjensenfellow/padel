<template>
  <h3 class="text-center md-3">Resultat</h3>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Namn</th>
        <th scope="col">Poäng</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(player, index) in getPlayers" :key="player.id">
        <th scope="row">{{ Number(index) + 1 }}</th>
        <td>{{ player.name }}</td>
        <td>{{ player.score }}</td>
      </tr>
    </tbody>
  </table>
  <div class="clearfix">
    <button @click="goBack" class="btn btn-pdl mt-3 float-left">
      <i class="las la-arrow-left"></i> Resultat
    </button>
    <button @click="newGame" class="btn btn-pdl mt-3 float-right">
      Ny match <i class="las la-undo-alt"></i>
    </button>
  </div>
</template>

<script lang="ts">
import { sortByScore } from "@/services/scoreService";
import store from "@/store/index";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    goBack(): void {
      store.commit.americanoStore.DECREMENT_STEP();
    },
    newGame(): void {
      store.dispatch.americanoStore.newGame();
    },
  },
  computed: {
    getPlayers() {
      store.dispatch.americanoStore.sortPlayersByScore();
      return store.getters.americanoStore.getPlayers;
    },
  },
});
</script>

<style>
</style>