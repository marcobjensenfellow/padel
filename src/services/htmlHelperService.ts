import { GameSide } from "@/models/gameSide.enum";
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";
import store from "@/store/index";

export function getFullPlayerNames(game: PadelGame, side: GameSide) {
    const isHome = side === GameSide.Home;

    const players = game.players.filter((p) => p.home === isHome);

    const firstPlayer = store.getters.americanoStore.getPlayers.find(
        (p) => p.id === players[0].playerId
    );

    const secondPlayer = store.getters.americanoStore.getPlayers.find(
        (p) => p.id === players[1].playerId
    );

    if (!firstPlayer || !secondPlayer) {
        console.error(
            `Could not find players with id ${players[0].playerId} or ${players[1].playerId}`
        );
        return;
    }

    return `${firstPlayer.name} & ${secondPlayer.name}`;
}

export function isValidMaxScore(value: number): boolean {
    if (!value) {
        return false;
    }

    if (value === null) {
        return false;
    }

    if (isNaN(value)) {
        return false;
    }

    if (value <= 0) {
        return false;
    }

    return true;
}
