import { chooseSides, playersCanTeam, pairTeams } from "@/services/sideService";
import { makePlayer, makePlayers } from "./helpers";

// ─── chooseSides ──────────────────────────────────────────────────────────────

describe("chooseSides", () => {
    it("honours explicit Left preference for the first player", () => {
        const [s1] = chooseSides(
            makePlayer(1, { preferredSide: "Left" }),
            makePlayer(2)
        );
        expect(s1).toBe("Left");
    });

    it("honours explicit Right preference for the second player", () => {
        const [, s2] = chooseSides(
            makePlayer(1),
            makePlayer(2, { preferredSide: "Right" })
        );
        expect(s2).toBe("Right");
    });

    it("resolves both-left conflict by giving first player their preference", () => {
        const [s1, s2] = chooseSides(
            makePlayer(1, { preferredSide: "Left" }),
            makePlayer(2, { preferredSide: "Left" })
        );
        expect(s1).toBe("Left");
        expect(s2).toBe("Right");
    });

    it("returns a valid pair when both are Both", () => {
        const [s1, s2] = chooseSides(makePlayer(1), makePlayer(2));
        expect(["Left", "Right"]).toContain(s1);
        expect(["Left", "Right"]).toContain(s2);
    });
});

// ─── playersCanTeam ───────────────────────────────────────────────────────────

describe("playersCanTeam", () => {
    it("returns true when one player has no side preference", () => {
        expect(
            playersCanTeam(
                makePlayer(1, { preferredSide: "Both" }),
                makePlayer(2, { preferredSide: "Left" })
            )
        ).toBe(true);
    });

    it("returns true when both prefer different fixed sides", () => {
        expect(
            playersCanTeam(
                makePlayer(1, { preferredSide: "Left" }),
                makePlayer(2, { preferredSide: "Right" })
            )
        ).toBe(true);
    });

    it("returns false when both insist on the same fixed side", () => {
        expect(
            playersCanTeam(
                makePlayer(1, { preferredSide: "Left" }),
                makePlayer(2, { preferredSide: "Left" })
            )
        ).toBe(false);
    });
});

// ─── pairTeams ────────────────────────────────────────────────────────────────

describe("pairTeams", () => {
    it("returns two teams of 2 from a group of 4", () => {
        const [t1, t2] = pairTeams(makePlayers(4));
        expect(t1.length).toBe(2);
        expect(t2.length).toBe(2);
    });

    it("covers all 4 players exactly once", () => {
        const players = makePlayers(4);
        const [t1, t2] = pairTeams(players);
        const allIds = [...t1, ...t2].map(p => p.id);
        expect(new Set(allIds).size).toBe(4);
    });

    it("avoids pairing two players who insist on the same side", () => {
        const group = [
            makePlayer(1, { preferredSide: "Left" }),
            makePlayer(2, { preferredSide: "Left" }),
            makePlayer(3, { preferredSide: "Right" }),
            makePlayer(4, { preferredSide: "Right" }),
        ];
        const [t1, t2] = pairTeams(group);
        expect(playersCanTeam(t1[0], t1[1])).toBe(true);
        expect(playersCanTeam(t2[0], t2[1])).toBe(true);
    });
});
