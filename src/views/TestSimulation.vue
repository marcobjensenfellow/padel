<template>
    <div class="p-4">
        <h1>Test Simulation</h1>
        <p>Number of games: {{ games.length }}</p>

        <table class="table table-sm mt-3">
            <thead>
                <tr>
                    <th>Round</th>
                    <th>Match</th>
                    <th>Home team (side)</th>
                    <th>Away team (side)</th>
                    <th>Score</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="game in games" :key="game.id">
                    <td>{{ game.round }}</td>
                    <td>{{ game.matchNumber }}</td>
                    <td>{{ getTeamString(game, true) }}</td>
                    <td>{{ getTeamString(game, false) }}</td>
                    <td>{{ game.homeScore }} - {{ game.awayScore }}</td>
                </tr>
            </tbody>
        </table>

        <h2 class="mt-4">Summary</h2>
        <table class="table table-sm">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Points</th>
                    <th>Matches</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="player in players" :key="player.id">
                    <td>{{ player.id }}</td>
                    <td>{{ player.name }}</td>
                    <td>{{ player.score }}</td>
                    <td>{{ getMatchCount(player.id) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { getPadelPlayers, prepareGames } from "@/services/americanoService";
import { updatePlayerScores } from "@/services/scoreService";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import { PadelGame } from "@/models/padelGame.interface";

export default defineComponent({
    data() {
        return {
            players: [] as PadelPlayer[],
            games: [] as PadelGame[],
        };
    },
    created() {
        this.runSimulation();
    },
    methods: {
        runSimulation() {
            this.players = getPadelPlayers();
            this.players.forEach((p) => (p.name = `Player ${p.id}`));
            this.games = prepareGames(this.players, true);
            this.games.forEach((g) => {
                g.homeScore = Math.floor(Math.random() * 33);
                g.awayScore = Math.floor(Math.random() * 33);
            });
            this.players = updatePlayerScores(this.players, this.games);
        },
        getPlayerName(id: number) {
            const p = this.players.find((pl) => pl.id === id);
            return p ? p.name : "";
        },
        getTeamString(game: PadelGame, home: boolean) {
            const sidePlayers = game.players.filter((p) => p.home === home);
            return sidePlayers
                .map((p) => `${this.getPlayerName(p.playerId)} (${p.side})`)
                .join(" & ");
        },
        getMatchCount(id: number) {
            return this.games.filter((g) =>
                g.players.some((p) => p.playerId === id)
            ).length;
        },
    },
});
</script>

<style scoped>
.table-sm th,
.table-sm td {
    font-size: 0.9rem;
}
</style>
