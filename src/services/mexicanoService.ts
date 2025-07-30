import { PadelGame } from "@/models/padelGame.interface";
import { PadelPlayer, PreferredSide } from "@/models/padelPlayer.interface";
import { balancePlayerSides } from "./americanoService";

function chooseSides(
    first: PadelPlayer,
    second: PadelPlayer
): [PreferredSide, PreferredSide] {
    if (first.preferredSide === "Left" && second.preferredSide !== "Left") {
        return ["Left", "Right"];
    }

    if (second.preferredSide === "Left" && first.preferredSide !== "Left") {
        return ["Right", "Left"];
    }

    if (first.preferredSide === "Right" && second.preferredSide !== "Right") {
        return ["Right", "Left"];
    }

    if (second.preferredSide === "Right" && first.preferredSide !== "Right") {
        return ["Left", "Right"];
    }

    return ["Left", "Right"];
}

export function prepareMexicanoRound(
    players: PadelPlayer[],
    round: number
): PadelGame[] {
    const sorted = [...players].sort((a, b) => {
        if (a.score === b.score) return a.seed - b.seed;
        return b.score - a.score;
    });

    const games: PadelGame[] = [];

    for (let i = 0; i < sorted.length; i += 4) {
        const group = sorted.slice(i, i + 4);
        if (group.length < 4) {
            group.forEach(p => {
                games.push({
                    homeScore: null,
                    awayScore: null,
                    players: [{ playerId: p.id, home: true, side: "Left" }],
                    matchNumber: 0,
                    round,
                    id: games.length + 1,
                    playGroup: 1,
                });
            });
            continue;
        }

        const [s1, s2] = chooseSides(group[0], group[1]);
        const [s3, s4] = chooseSides(group[2], group[3]);

        games.push({
            homeScore: null,
            awayScore: null,
            players: [
                { playerId: group[0].id, home: true, side: s1 },
                { playerId: group[1].id, home: true, side: s2 },
                { playerId: group[2].id, home: false, side: s3 },
                { playerId: group[3].id, home: false, side: s4 },
            ],
            matchNumber: Math.floor(i / 4) + 1,
            round,
            id: games.length + 1,
            playGroup: 1,
        });
    }

    balancePlayerSides(games, players);

    return games;
}

export function totalRounds(amountOfPlayers: number): number {
    return amountOfPlayers - 1;
}
