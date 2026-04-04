/**
 * @jest-environment jsdom
 */
import {
    getHistory,
    upsertToHistory,
    removeFromHistory,
    TournamentSummary,
} from "@/services/tournamentHistoryService";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeSummary(overrides: Partial<TournamentSummary> = {}): TournamentSummary {
    return {
        id: `t_${Date.now()}_${Math.random()}`,
        name: "Test Tournament",
        savedAt: new Date().toISOString(),
        format: "Americano",
        numPlayers: 8,
        roundsPlayed: 3,
        totalRounds: 7,
        completed: false,
        top3: [
            { name: "Alice", score: 60 },
            { name: "Bob",   score: 50 },
            { name: "Carl",  score: 40 },
        ],
        players: [
            { name: "Alice", score: 60 },
            { name: "Bob",   score: 50 },
            { name: "Carl",  score: 40 },
            { name: "Dana",  score: 30 },
        ],
        ...overrides,
    };
}

// Clear localStorage between tests to keep them independent
beforeEach(() => {
    localStorage.clear();
});

// ─── getHistory ───────────────────────────────────────────────────────────────

describe("getHistory", () => {
    it("returns an empty array when no tournaments have been saved", () => {
        expect(getHistory()).toEqual([]);
    });

    it("returns previously saved entries", () => {
        const entry = makeSummary();
        upsertToHistory(entry);
        expect(getHistory().length).toBe(1);
    });

    it("returns entries in insertion order (most recent first)", () => {
        const first  = makeSummary({ id: "first",  name: "First" });
        const second = makeSummary({ id: "second", name: "Second" });
        upsertToHistory(first);
        upsertToHistory(second);
        const history = getHistory();
        expect(history[0].id).toBe("second");
        expect(history[1].id).toBe("first");
    });
});

// ─── upsertToHistory ──────────────────────────────────────────────────────────

describe("upsertToHistory", () => {
    it("adds a new entry when id does not exist", () => {
        const entry = makeSummary({ id: "new-1" });
        upsertToHistory(entry);
        expect(getHistory().find(h => h.id === "new-1")).toBeDefined();
    });

    it("updates an existing entry when id already exists", () => {
        const entry = makeSummary({ id: "upd-1", roundsPlayed: 2 });
        upsertToHistory(entry);

        const updated = { ...entry, roundsPlayed: 5, completed: true };
        upsertToHistory(updated);

        const history = getHistory();
        expect(history.length).toBe(1); // no duplicate
        expect(history[0].roundsPlayed).toBe(5);
        expect(history[0].completed).toBe(true);
    });

    it("keeps at most 100 entries", () => {
        for (let i = 0; i < 105; i++) {
            upsertToHistory(makeSummary({ id: `t${i}` }));
        }
        expect(getHistory().length).toBe(100);
    });

    it("persists data across multiple calls without data loss", () => {
        upsertToHistory(makeSummary({ id: "a", name: "A" }));
        upsertToHistory(makeSummary({ id: "b", name: "B" }));
        upsertToHistory(makeSummary({ id: "c", name: "C" }));
        const history = getHistory();
        expect(history.map(h => h.name).sort()).toEqual(["A", "B", "C"]);
    });
});

// ─── removeFromHistory ────────────────────────────────────────────────────────

describe("removeFromHistory", () => {
    it("removes the entry with the given id", () => {
        upsertToHistory(makeSummary({ id: "del-1" }));
        upsertToHistory(makeSummary({ id: "del-2" }));
        removeFromHistory("del-1");
        const history = getHistory();
        expect(history.find(h => h.id === "del-1")).toBeUndefined();
        expect(history.find(h => h.id === "del-2")).toBeDefined();
    });

    it("does nothing when id does not exist", () => {
        upsertToHistory(makeSummary({ id: "keep-1" }));
        expect(() => removeFromHistory("nonexistent")).not.toThrow();
        expect(getHistory().length).toBe(1);
    });
});
