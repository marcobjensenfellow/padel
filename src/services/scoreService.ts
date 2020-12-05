import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";

export function updatePlayerScores(
    players: PadelPlayer[],
    games: PadelGame[]
): PadelPlayer[] {
    players.forEach((player) => {
        games.forEach((game) => {
            const playerScore = game.players.find(
                (score) => score.playerId === player.id
            );

            if (!playerScore) {
                return;
            }

            if (game.homeScore === null) {
                game.homeScore = 0;
            }

            if (game.awayScore === null) {
                game.awayScore = 0;
            }

            if (playerScore.home) {
                player.score += Number(game.homeScore);
            } else {
                player.score += Number(game.awayScore);
            }
        });
    });

    return players;
}

function compareScore(a: PadelPlayer, b: PadelPlayer) {
    if (a.score > b.score) {
        return -1;
    }
    if (a.score < b.score) {
        return 1;
    }
    return 0;
}

export function sortByScore(players: PadelPlayer[]) {
    return players.sort(compareScore);
}
