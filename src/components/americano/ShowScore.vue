<template>
    <h3 class="text-center md-3">Results</h3>
    <div v-if="!showTwoTables">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Points</th>
                </tr>
            </thead>
            <tbody>
                <tr
                    v-for="(player, index) in getAllPlayers()"
                    :key="player.id"
                    :class="{
                        'is-second': getColorCodeGroup(player) === 2,
                        'is-first': getColorCodeGroup(player) === 1,
                    }"
                >
                    <th scope="row">{{ Number(index) + 1 }}</th>
                    <td>{{ player.name }}</td>
                    <td>{{ player.score }}</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div v-if="showTwoTables">
        <div class="row">
            <div class="col-6">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(player, index) in getFirstGroup()"
                            :key="player.id"
                            :class="{
                                'is-first': getColorCodeGroup(player) === 1,
                            }"
                        >
                            <th scope="row">{{ Number(index) + 1 }}</th>
                            <td>{{ player.name }}</td>
                            <td>{{ player.score }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="col-6">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(player, index) in getSecondGroup()"
                            :key="player.id"
                            :class="{
                                'is-second': getColorCodeGroup(player) === 2,
                            }"
                        >
                            <th scope="row">{{ Number(index) + 1 }}</th>
                            <td>{{ player.name }}</td>
                            <td>{{ player.score }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="clearfix">
        <button @click="goBack" class="btn btn-pdl mt-3 float-left">
            <i class="las la-arrow-left"></i> Results
        </button>

        <button @click="newGame" class="btn btn-pdl mt-3 float-right">
            New match <i class="las la-undo-alt"></i>
        </button>

        <button
            v-if="twoGroupOfPlayers"
            @click="changeGrouping"
            class="btn btn-pdl mt-3 mr-3 float-right"
        >
            <i class="las la-exchange-alt"></i> Change grouping
        </button>
    </div>
</template>

<script lang="ts">
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { getColorCodeGroupFromPlayer } from "@/services/americanoService";
import { sortByScore } from "@/services/scoreService";
import store from "@/store/index";
import { defineComponent } from "vue";

export default defineComponent({
    data: function() {
        return {
            twoGroupOfPlayers: false,
            showTwoTables: false,
        };
    },
    methods: {
        goBack(): void {
            store.commit.americanoStore.DECREMENT_STEP();
        },
        newGame(): void {
            store.dispatch.americanoStore.newGame();
        },
        changeGrouping() {
            if (!this.$data.twoGroupOfPlayers) {
                this.$data.showTwoTables = false;
                return;
            }
            this.$data.showTwoTables = !this.$data.showTwoTables;
        },
        getColorCodeGroup(player: PadelPlayer) {
            if (store.getters.americanoStore.getRules.colorCode === false) {
                return 0;
            }

            return getColorCodeGroupFromPlayer(
                player,
                store.getters.americanoStore.getPlayers,
                store.getters.americanoStore.getGames
            );
        },
        getAllPlayers() {
            const players = this.getPlayers;

            if (players.length === 16) {
                this.$data.twoGroupOfPlayers = true;
            }

            return players;
        },
        getFirstGroup() {
            const players = store.getters.americanoStore.getPlayers;

            const firstGroupPlayers = [] as PadelPlayer[];

            players.forEach(player => {
                const group = getColorCodeGroupFromPlayer(
                    player,
                    players,
                    store.getters.americanoStore.getGames
                );
                if (group === 1) {
                    firstGroupPlayers.push(player);
                }
            });

            return firstGroupPlayers;
        },
        getSecondGroup() {
            const players = store.getters.americanoStore.getPlayers;

            const secondGroupPlayers = [] as PadelPlayer[];

            players.forEach(player => {
                const group = getColorCodeGroupFromPlayer(
                    player,
                    players,
                    store.getters.americanoStore.getGames
                );
                if (group === 2) {
                    secondGroupPlayers.push(player);
                }
            });

            return secondGroupPlayers;
        },
        shouldShowTwoTables() {
            return this.$data.twoGroupOfPlayers && this.$data.showTwoTables;
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

<style></style>
