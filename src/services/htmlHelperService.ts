import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";

export function getFullPlayerNames(
    padelPlayers: PadelPlayer[],
    game: PadelGame,
    side: string
) {
    let isHome: boolean;

    if (side === "home") {
        isHome = true;
    } else if (side === "away") {
        isHome = false;
    } else {
        console.error(`${side} is not a valid side`);
        return;
    }

    const players = game.players.filter((p) => p.home === isHome);

    const firstPlayer = padelPlayers.find((p) => p.id === players[0].playerId);

    const secondPlayer = padelPlayers.find((p) => p.id === players[1].playerId);

    if (!firstPlayer || !secondPlayer) {
        console.error(
            `Could not find players with id ${players[0].playerId} or ${players[1].playerId}`
        );
        return;
    }

    return `${firstPlayer.name} & ${secondPlayer.name}`;
}
