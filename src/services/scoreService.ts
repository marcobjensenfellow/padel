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

function getValidScore(score: number | null) {
    if (score === null) {
        return null;
    }

    if (isNaN(score)) {
        return null;
    }

    return score;
}

export function removeNotNumbers(game: PadelGame, side: string) {
    let isHome;
    if (side === "home") {
        isHome = true;
    } else if (side === "away") {
        isHome = false;
    } else {
        console.log("Side is not defined");
        return;
    }

    if (isHome) {
        game.homeScore = getValidScore(game.homeScore);
    } else if (isHome === false) {
        game.awayScore = getValidScore(game.awayScore);
    }
}
