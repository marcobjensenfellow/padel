import { GameSide } from "@/models/gameSide.enum";
import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer } from "@/models/padelPlayer.interface";

export function updatePlayerScores(
    players: PadelPlayer[],
    games: PadelGame[]
): PadelPlayer[] {
    // reset score
    players.forEach((player) => (player.score = 0));

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

function compareId(a: PadelPlayer, b: PadelPlayer) {
    if (a.id < b.id) {
        return -1;
    }
    if (a.id > b.id) {
        return 1;
    }
    return 0;
}

export function sortByScore(players: PadelPlayer[]) {
    return players.sort(compareScore);
}

export function sortById(players: PadelPlayer[]) {
    return players.sort(compareId);
}

function getValidScore(score: number | null, maxScore: number) {
    if (score === null) {
        return null;
    }

    if (isNaN(score)) {
        return null;
    }

    if (score > maxScore) {
        return maxScore;
    }

    if (score < 0) {
        return 0;
    }

    return Number(score);
}

export function removeNotNumbers(
    game: PadelGame,
    side: GameSide,
    maxScore: number
) {
    if (side === GameSide.Home) {
        game.homeScore = getValidScore(game.homeScore, maxScore);
    } else if (side === GameSide.Away) {
        game.awayScore = getValidScore(game.awayScore, maxScore);
    } else {
        console.log("Side not defined");
    }
}

export function evenScore(game: PadelGame, maxScore: number, side: GameSide) {
    if (side === GameSide.Home) {
        if (game.homeScore === null) {
            return;
        }

        const newAwayScore = maxScore - game.homeScore;
        game.awayScore = newAwayScore;
    }

    if (side === GameSide.Away) {
        if (game.awayScore === null) {
            return;
        }

        const newAwayScore = maxScore - game.awayScore;
        game.homeScore = newAwayScore;
    }
}
