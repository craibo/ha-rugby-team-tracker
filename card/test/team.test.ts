import { describe, expect, it } from "vitest";
import {
  buildTeamView,
  deriveTeamEntities,
  deriveTeamName,
  validateTeamConfig,
  teamEntityIds,
  shouldUpdateTeamCard,
  teamCardSize,
  buildEditorConfig,
  teamStubConfig,
} from "../src/team";
import { registerCard } from "../src/register";
import { entitiesChanged } from "../src/editor-helpers";
import type { HassEntity } from "../src/state";

describe("deriveTeamEntities", () => {
  const expected = (p: string) => ({
    current: `${p}_current_game`,
    next: `${p}_next_game`,
    previous: [1, 2, 3, 4, 5].map((n) => `${p}_previous_game_${n}`),
  });
  it("derives from each suffix", () => {
    for (const s of ["_current_game", "_next_game", "_previous_game_1", "_previous_game_5"]) {
      expect(deriveTeamEntities(`sensor.leinster${s}`)).toEqual(expected("sensor.leinster"));
    }
  });
  it("keeps previous order", () => {
    expect(deriveTeamEntities("sensor.a_next_game")?.previous[0]).toBe("sensor.a_previous_game_1");
    expect(deriveTeamEntities("sensor.a_next_game")?.previous[4]).toBe("sensor.a_previous_game_5");
  });
  it("returns undefined for non-matching", () => {
    expect(deriveTeamEntities("sensor.leinster")).toBeUndefined();
    expect(deriveTeamEntities("sensor.a_previous_game_6")).toBeUndefined();
    expect(deriveTeamEntities("sensor.a_previous_game_0")).toBeUndefined();
    expect(deriveTeamEntities("sensor.a_next_game_x")).toBeUndefined();
  });
});

const base = {
  opposition: "Wallabies",
  home_away: "home",
  kickoff: "2026-11-21T09:00:00+00:00",
  venue: "Murrayfield",
  home_team: "Scotland",
  away_team: "Wallabies",
  home_score: null,
  away_score: null,
  period: "Kick off",
  minute: null,
  status: "upcoming",
  match_url: "x",
  logos: {},
};
const ent = (state: string, over: Record<string, unknown> = {}): HassEntity => ({
  state,
  attributes: { ...base, ...over },
});
const live = ent("Second Half", { period: "Second Half", minute: 60, home_score: 3, away_score: 0 });
const none: HassEntity = { state: "No game in progress", attributes: {} };
const next = ent("2026-11-21T09:00:00+00:00");
const prev = (state: string, over: Record<string, unknown> = {}) => ent(state, { period: "Result", ...over });

const cfg = {
  current: "c",
  next: "n",
  previous: ["p1", "p2", "p3", "p4", "p5"],
};

describe("buildTeamView moreInfoEntity", () => {
  it("is the current sensor while live", () => {
    expect(buildTeamView({ c: live, n: next }, cfg, "en", "UTC").moreInfoEntity).toBe("c");
  });
  it("is the next sensor when not live", () => {
    expect(buildTeamView({ c: none, n: next }, cfg, "en", "UTC").moreInfoEntity).toBe("n");
    expect(buildTeamView({}, cfg, "en", "UTC").moreInfoEntity).toBe("n");
  });
  it("falls back to current when no next is configured", () => {
    expect(buildTeamView({ c: none }, { current: "c" }, "en", "UTC").moreInfoEntity).toBe("c");
  });
});

describe("buildTeamView top", () => {
  it("prefers live current", () => {
    const v = buildTeamView({ c: live, n: next }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("live");
  });
  it("treats half time as the current live game", () => {
    const ht = ent("Half Time", { period: "Half Time", minute: 41, home_score: 12, away_score: 5 });
    const v = buildTeamView({ c: ht, n: next }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("live");
    expect(v.top.badge).toBe("Half Time");
  });
  it("falls back to next", () => {
    const v = buildTeamView({ c: none, n: next }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("upcoming");
  });
  it("empty when neither", () => {
    const v = buildTeamView({ c: none, n: { state: "unknown", attributes: {} } }, cfg, "en", "UTC");
    expect(v.top.mode).toBe("empty");
    expect(buildTeamView({}, cfg, "en", "UTC").top.headline).toBe("No game");
  });
  it("heading from title", () => {
    expect(buildTeamView({}, { ...cfg, title: "Leinster" }, "en", "UTC").heading).toBe("Leinster");
    expect(buildTeamView({}, cfg, "en", "UTC").heading).toBeUndefined();
  });
  it("heading defaults to the followed team's name", () => {
    expect(buildTeamView({ n: next }, cfg, "en", "UTC").heading).toBe("Scotland");
  });
  it("title overrides the derived name; empty or non-string title does not", () => {
    expect(buildTeamView({ n: next }, { ...cfg, title: "My side" }, "en", "UTC").heading).toBe("My side");
    for (const bad of ["", 5, null, {}]) {
      expect(buildTeamView({ n: next }, { ...cfg, title: bad as never }, "en", "UTC").heading).toBe("Scotland");
    }
  });
  it("show_header false hides it, even with a title", () => {
    expect(buildTeamView({ n: next }, { ...cfg, show_header: false }, "en", "UTC").heading).toBeUndefined();
    expect(
      buildTeamView({ n: next }, { ...cfg, title: "X", show_header: false }, "en", "UTC").heading,
    ).toBeUndefined();
    expect(buildTeamView({ n: next }, { ...cfg, show_header: true }, "en", "UTC").heading).toBe("Scotland");
    expect(buildTeamView({ n: next }, { ...cfg, show_header: "no" as never }, "en", "UTC").heading).toBe("Scotland");
  });
  it("top block carries team and match urls for live and next", () => {
    const urls = {
      match_url: "https://www.rugbypass.com/live/a/?g=1",
      home_team_url: "https://www.rugbypass.com/teams/scotland/",
      away_team_url: "https://www.rugbypass.com/teams/australia/",
    };
    const n = { ...next, attributes: { ...next.attributes, ...urls } };
    const top = buildTeamView({ n }, cfg, "en", "UTC").top;
    expect(top.mode).toBe("upcoming");
    expect(top.matchUrl).toBe(urls.match_url);
    expect(top.home.url).toBe(urls.home_team_url);
    expect(top.away.url).toBe(urls.away_team_url);
  });
});

describe("buildTeamView previous", () => {
  it("skips unknown slots and preserves order", () => {
    const states = {
      p1: prev("W 24–17", { opposition: "Munster" }),
      p2: { state: "unknown", attributes: {} },
      p3: prev("L 5–50", { opposition: "Ulster", home_away: "away" }),
      p4: { state: "unavailable", attributes: { opposition: "X" } },
    };
    const v = buildTeamView(states, cfg, "en", "UTC");
    expect(v.previous.map((r) => r.opposition)).toEqual(["Munster", "Ulster"]);
    expect(v.previous[0]).toMatchObject({ score: "W 24–17", outcome: "win", location: "Murrayfield" });
    expect(v.previous[1]).toMatchObject({ score: "L 5–50", outcome: "loss", location: "Murrayfield" });
    expect("venue" in v.previous[0]).toBe(false);
  });
  it("location is trimmed venue, else undefined", () => {
    const loc = (venue: unknown) =>
      buildTeamView({ p1: prev("W 1–0", { venue }) }, cfg, "en", "UTC").previous[0].location;
    expect(loc("  Stade de France ")).toBe("Stade de France");
    for (const bad of [undefined, null, "", "   ", 5, {}]) expect(loc(bad)).toBeUndefined();
  });
  it("parses draw and unavailable result", () => {
    const v = buildTeamView(
      { p1: prev("D 10–10"), p2: prev("Result unavailable") },
      cfg,
      "en",
      "UTC",
    );
    expect(v.previous[0].outcome).toBe("draw");
    expect(v.previous[1]).toMatchObject({ outcome: "unknown", score: "Result unavailable" });
  });
  it("formats date with timezone", () => {
    const k = { kickoff: "2026-11-21T23:30:00+00:00" };
    const utc = buildTeamView({ p1: prev("W 1–0", k) }, cfg, "en-GB", "UTC").previous[0].date;
    const syd = buildTeamView({ p1: prev("W 1–0", k) }, cfg, "en-GB", "Australia/Sydney").previous[0].date;
    expect(utc).toBe("21 Nov");
    expect(syd).toBe("22 Nov");
  });
  it("does not throw on bad data", () => {
    const states = {
      p1: prev("W 1–0", { kickoff: "garbage" }),
      p2: prev("W 1–0", { kickoff: 5, opposition: "A" }),
      p3: prev("W 1–0", { home_away: 7, opposition: "B" }),
      p4: { state: "W 1–0", attributes: "nope" as unknown as Record<string, unknown> },
      p5: prev("W 1–0", { opposition: 3 }),
    };
    const v = buildTeamView(states, cfg, "en", "UTC");
    expect(v.previous.length).toBe(3);
    expect(v.previous[0].date).toBe("garbage");
    expect(v.previous[1].date).toBe("–");
    expect(() => buildTeamView(states, cfg, "en", "Not/AZone")).not.toThrow();
    expect(buildTeamView(states, cfg, "en", "Not/AZone").previous[0].date).toBe("garbage");
    expect(buildTeamView({ p1: prev("W 1–0") }, cfg, "en", "Not/AZone").previous[0].date).toBe(
      "2026-11-21T09:00:00+00:00",
    );
  });
  it("rank is the opposition's: away_rank when we are home", () => {
    const r = buildTeamView(
      { p1: prev("W 1–0", { home_away: "home", home_rank: 2, away_rank: 9 }) },
      cfg,
      "en",
      "UTC",
    ).previous[0];
    expect(r.rank).toBe(9);
    expect(r.rankLabel).toBe("9th");
  });
  it("rank is the opposition's: home_rank when we are away", () => {
    const r = buildTeamView(
      { p1: prev("L 0–1", { home_away: "away", opposition: "Scotland", home_rank: 1, away_rank: 13 }) },
      cfg,
      "en",
      "UTC",
    ).previous[0];
    expect(r.rank).toBe(1);
    expect(r.rankLabel).toBe("1st");
  });
  it("rank label follows the locale", () => {
    const r = buildTeamView({ p1: prev("W 1–0", { away_rank: 4 }) }, cfg, "de", "UTC").previous[0];
    expect(r.rankLabel).toBe("#4");
  });
  it("no rank when missing, invalid or home_away unknown", () => {
    const rank = (over: Record<string, unknown>) =>
      buildTeamView({ p1: prev("W 1–0", over) }, cfg, "en", "UTC").previous[0];
    for (const bad of [undefined, null, "3", 0, -2, 1.5, NaN, true]) {
      const r = rank({ home_rank: bad, away_rank: bad });
      expect(r.rank).toBeUndefined();
      expect(r.rankLabel).toBeUndefined();
      expect(r.opposition).toBe("Wallabies");
    }
    expect(rank({ home_away: 7, home_rank: 1, away_rank: 2 }).rank).toBeUndefined();
    expect(rank({ home_away: undefined, home_rank: 1, away_rank: 2 }).rank).toBeUndefined();
  });
  it("handles missing previous config", () => {
    expect(buildTeamView({}, { next: "n" }, "en", "UTC").previous).toEqual([]);
  });
});

describe("validateTeamConfig", () => {
  it("errors when none of the keys is present", () => {
    expect(() => validateTeamConfig({} as never)).toThrow(/rugby-tracker-team-card/);
    expect(() => validateTeamConfig({ title: "x" } as never)).toThrow();
    expect(() => validateTeamConfig(undefined as never)).toThrow();
  });
  it("accepts present-but-empty keys as unconfigured", () => {
    expect(() => validateTeamConfig({ next: "" })).not.toThrow();
    expect(() => validateTeamConfig({ previous: [] })).not.toThrow();
    expect(() => validateTeamConfig({ current: "" })).not.toThrow();
    expect(validateTeamConfig({ next: "" }).previous).toEqual([]);
  });
  it("keeps a string title and a boolean show_header, drops other types", () => {
    expect(validateTeamConfig({ next: "a", title: "T", show_header: false })).toMatchObject({
      title: "T",
      show_header: false,
    });
    const bad = validateTeamConfig({ next: "a", title: 5, show_header: "yes" } as never);
    expect("title" in bad).toBe(false);
    expect("show_header" in bad).toBe(false);
  });
  it("accepts next, current or previous", () => {
    expect(validateTeamConfig({ next: "a" }).next).toBe("a");
    expect(validateTeamConfig({ current: "a" }).current).toBe("a");
    expect(validateTeamConfig({ previous: ["a"] }).previous).toEqual(["a"]);
  });
  it("trims previous to 5 without mutating", () => {
    const input = { previous: ["1", "2", "3", "4", "5", "6", "7"] };
    const out = validateTeamConfig(input);
    expect(out.previous).toHaveLength(5);
    expect(input.previous).toHaveLength(7);
  });
  it("teamEntityIds lists all configured", () => {
    expect(teamEntityIds({ current: "c", next: "n", previous: ["a", "b"] })).toEqual(["c", "n", "a", "b"]);
    expect(teamEntityIds({ next: "n" })).toEqual(["n"]);
  });
});

describe("entitiesChanged", () => {
  const a = { state: "1" };
  const b = { state: "2" };
  it("false when watched unchanged", () => {
    expect(entitiesChanged({ x: a, y: b, z: {} }, { x: a, y: b, z: {} }, ["x", "y"])).toBe(false);
  });
  it("true when any watched changed", () => {
    expect(entitiesChanged({ x: a, y: b }, { x: a, y: { state: "2" } }, ["x", "y"])).toBe(true);
  });
  it("true with no prev hass", () => {
    expect(entitiesChanged(undefined, { x: a }, ["x"])).toBe(true);
  });
});

describe("shouldUpdateTeamCard", () => {
  const a = { state: "1" };
  const config = { next: "n", previous: ["p1"] };
  const states = { n: a, p1: a, other: a };
  it("true on first render (no config)", () => {
    expect(shouldUpdateTeamCard(undefined, false, false, undefined, states)).toBe(true);
  });
  it("true when config changed", () => {
    expect(shouldUpdateTeamCard(config, true, false, states, states)).toBe(true);
  });
  it("true when a configured entity changed", () => {
    expect(shouldUpdateTeamCard(config, false, true, states, { ...states, p1: { state: "2" } })).toBe(true);
  });
  it("false when only an unrelated entity changed", () => {
    expect(shouldUpdateTeamCard(config, false, true, states, { ...states, other: { state: "2" } })).toBe(false);
  });
  it("true when nothing tracked changed (other props)", () => {
    expect(shouldUpdateTeamCard(config, false, false, states, states)).toBe(true);
  });
});

describe("teamCardSize", () => {
  it("is 2 + min(5, rows)", () => {
    expect(teamCardSize(0)).toBe(2);
    expect(teamCardSize(3)).toBe(5);
    expect(teamCardSize(9)).toBe(7);
  });
});

describe("teamStubConfig", () => {
  it("derives from first rugby tracker sensor", () => {
    const c = teamStubConfig({ "sensor.t": {}, "sensor.leinster_next_game": {} });
    expect(c).toMatchObject({
      type: "custom:rugby-tracker-team-card",
      current: "sensor.leinster_current_game",
      next: "sensor.leinster_next_game",
    });
    expect(c.previous).toHaveLength(5);
  });
  it("falls back to empty next", () => {
    expect(teamStubConfig({ "light.a": {} })).toEqual({ type: "custom:rugby-tracker-team-card", next: "" });
    expect(teamStubConfig(undefined)).toEqual({ type: "custom:rugby-tracker-team-card", next: "" });
  });
  it("stub validates", () => {
    expect(() => validateTeamConfig(teamStubConfig(undefined))).not.toThrow();
  });
});

describe("buildEditorConfig", () => {
  it("derives all entities and title", () => {
    const c = buildEditorConfig("sensor.x_next_game", "X", "custom:rugby-tracker-team-card", undefined);
    expect(c).toEqual({
      type: "custom:rugby-tracker-team-card",
      title: "X",
      ...deriveTeamEntities("sensor.x_next_game"),
    });
  });
  it("writes show_header only when hidden, and never mutates the old config", () => {
    const old = { type: "t", next: "n", show_header: true };
    const c = buildEditorConfig("sensor.x_next_game", undefined, "t", old, false);
    expect(c.show_header).toBe(false);
    expect("show_header" in buildEditorConfig("sensor.x_next_game", undefined, "t", old, true)).toBe(false);
    expect("show_header" in buildEditorConfig("sensor.x_next_game", undefined, "t", old)).toBe(false);
    expect(old).toEqual({ type: "t", next: "n", show_header: true });
  });
  it("omits empty title", () => {
    expect("title" in buildEditorConfig("sensor.x_next_game", "", "t", undefined)).toBe(false);
  });
  it("re-pick replaces a custom previous list and returns fresh copies", () => {
    const old = { type: "t", next: "n", previous: ["custom1"] };
    const c = buildEditorConfig("sensor.y_current_game", undefined, "t", old);
    expect(c.previous).toHaveLength(5);
    expect(c.previous?.[0]).toBe("sensor.y_previous_game_1");
    expect(old.previous).toEqual(["custom1"]);
    const d = deriveTeamEntities("sensor.y_current_game")!;
    expect(c.previous).not.toBe(d.previous);
  });
  it("unmatched id sets only next", () => {
    expect(buildEditorConfig("sensor.other", undefined, "t", { type: "t", previous: ["a"] })).toEqual({
      type: "t",
      next: "sensor.other",
    });
  });
});

describe("deriveTeamName", () => {
  const a = (over: Record<string, unknown>): HassEntity => ({ state: "x", attributes: { ...base, ...over } });
  const c = { current: "c", next: "n", previous: ["p1", "p2"] };
  it("home_away home gives the home team, away gives the away team", () => {
    expect(deriveTeamName({ n: a({ home_away: "home" }) }, c)).toBe("Scotland");
    expect(deriveTeamName({ n: a({ home_away: "away" }) }, c)).toBe("Wallabies");
  });
  it("prefers next, then current, then previous in order", () => {
    const cur = a({ home_away: "home", home_team: "Cur" });
    const p1 = a({ home_away: "home", home_team: "P1" });
    const p2 = a({ home_away: "home", home_team: "P2" });
    expect(deriveTeamName({ n: a({ home_team: "Nxt" }), c: cur, p1, p2 }, c)).toBe("Nxt");
    expect(deriveTeamName({ c: cur, p1, p2 }, c)).toBe("Cur");
    expect(deriveTeamName({ p1, p2 }, c)).toBe("P1");
    expect(deriveTeamName({ p2 }, c)).toBe("P2");
  });
  it("skips entities without usable attributes", () => {
    const empty: HassEntity = { state: "No game in progress", attributes: {} };
    expect(deriveTeamName({ n: empty, c: empty, p1: a({ home_away: "away" }) }, c)).toBe("Wallabies");
    expect(deriveTeamName({ n: a({ home_away: "sideways" }), c: a({ home_away: "away" }) }, c)).toBe("Wallabies");
    expect(deriveTeamName({ n: a({ home_away: "home", home_team: "" }), c: a({ home_away: "away" }) }, c)).toBe(
      "Wallabies",
    );
  });
  it.each([
    ["Leinster Current game", "Leinster"],
    ["Leinster Next game", "Leinster"],
    ["Leinster Previous game 3", "Leinster"],
    ["Leinster next GAME", "Leinster"],
    ["Cardiff Blues  previous game 5", "Cardiff Blues"],
  ])("falls back to friendly name %s", (fn, want) => {
    const e: HassEntity = { state: "unknown", attributes: { friendly_name: fn } };
    expect(deriveTeamName({ n: e }, c)).toBe(want);
  });
  it("uses the first configured entity's friendly name", () => {
    const n: HassEntity = { state: "unknown", attributes: { friendly_name: "Leinster Next game" } };
    const cu: HassEntity = { state: "unknown", attributes: { friendly_name: "Other Current game" } };
    expect(deriveTeamName({ n, c: cu }, c)).toBe("Leinster");
  });
  it("is undefined with nothing to go on", () => {
    expect(deriveTeamName({}, c)).toBeUndefined();
    expect(deriveTeamName({ n: { state: "unknown", attributes: {} } }, c)).toBeUndefined();
    expect(deriveTeamName({ n: { state: "unknown", attributes: { friendly_name: "Current game" } } }, c)).toBeUndefined();
    expect(deriveTeamName({ n: a({}) }, {})).toBeUndefined();
  });
  it("never throws on wrong types", () => {
    const junk = [undefined, null, 5, "x", { state: 1, attributes: "nope" }, { attributes: null }, { attributes: { home_away: 7, home_team: {}, friendly_name: 9 } }];
    for (const j of junk) {
      expect(() => deriveTeamName({ n: j as never, c: j as never, p1: j as never }, c)).not.toThrow();
    }
    expect(() => deriveTeamName(undefined as never, c)).not.toThrow();
    expect(() => deriveTeamName({}, undefined as never)).not.toThrow();
    expect(() => deriveTeamName({}, { next: 5, previous: "x" } as never)).not.toThrow();
  });
});

describe("registerCard", () => {
  it("does not double-push", () => {
    const w: { customCards?: Array<Record<string, string>> } = {};
    const e = { type: "a", name: "A", description: "d" };
    registerCard(w, e);
    registerCard(w, e);
    registerCard(w, { ...e, type: "b" });
    expect(w.customCards?.map((c) => c.type)).toEqual(["a", "b"]);
  });
});

describe("buildTeamView previous matchUrl", () => {
  const U = "https://www.rugbypass.com/live/a-vs-b/?g=1";
  it("per row, safe only", () => {
    const v = buildTeamView(
      {
        p1: prev("W 1–0", { match_url: U }),
        p2: prev("W 1–0", { match_url: "javascript:alert(1)" }),
        p3: prev("W 1–0", { match_url: 7 }),
        p4: prev("W 1–0"),
      },
      cfg,
      "en",
      "UTC",
    );
    expect(v.previous.map((r) => r.matchUrl)).toEqual([U, undefined, undefined, undefined]);
  });
  it("top block carries matchUrl for live and for next", () => {
    const l = { ...live, attributes: { ...live.attributes, match_url: U } };
    expect(buildTeamView({ c: l, n: next }, cfg, "en", "UTC").top.matchUrl).toBe(U);
    // `next` has an unsafe match_url ("x"), so no link.
    expect(buildTeamView({ c: none, n: next }, cfg, "en", "UTC").top.matchUrl).toBeUndefined();
    const n = { ...next, attributes: { ...next.attributes, match_url: U } };
    expect(buildTeamView({ c: none, n }, cfg, "en", "UTC").top.matchUrl).toBe(U);
  });
});
