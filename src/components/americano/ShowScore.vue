<template>
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
</template>

<script lang="ts">
import { sortByScore } from "@/services/scoreService";
import store from "@/store/index";
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    getPlayers() {
      store.dispatch.americanoStore.sortPlayers();
      return store.getters.americanoStore.getPlayers;
    },
  },
});
</script>

<style>
</style>