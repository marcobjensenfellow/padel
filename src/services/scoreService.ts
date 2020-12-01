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

            if (playerScore.home) {
                player.score += Number(game.homeScore);
            } else {
                player.score += Number(game.awayScore);
            }
        });
    });

    return players;
}
