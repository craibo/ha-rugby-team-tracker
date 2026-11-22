import { entitiesChanged, pickStubEntity } from "./editor-helpers";
import { buildView, rankFields, safeMatchUrl, type CardView, type HassEntity } from "./state";

export type TeamConfig = {
  type?: string;
  title?: string;
  /** Show the header (default true). */
  show_header?: boolean;
  current?: string;
  next?: string;
  previous?: string[];
};

export type PreviousRow = {
  date: string;
  opposition: string;
  location?: string;
  /** The opposition's rank (league position or world ranking), if known. */
  rank?: number;
  /** `rank` formatted for the locale, e.g. "3rd". */
  rankLabel?: string;
  /** Validated data-source match page, if known. */
  matchUrl?: string;
  score: string;
  outcome: "win" | "loss" | "draw" | "unknown";
};

/** Accessible name for a previous-result row link. */
export const previousLinkLabel = (opposition: string): string =>
  `Open the match against ${opposition} on the website`;

export type TeamCardView = {
  top: CardView;
  previous: PreviousRow[];
  heading?: string;
  /** Sensor a long press opens: current game while live, else next game. */
  moreInfoEntity?: string;
};

const MAX_PREVIOUS = 5;
const SUFFIX = /_(?:current_game|next_game|previous_game_[1-5])$/;
const RESULT = /^([WLD]) \d+–\d+$/;

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v !== "" ? v : undefined;

export function deriveTeamEntities(
  entityId: string,
): { current: string; next: string; previous: string[] } | undefined {
  if (typeof entityId !== "string" || !SUFFIX.test(entityId)) return undefined;
  const prefix = entityId.replace(SUFFIX, "");
  return {
    current: `${prefix}_current_game`,
    next: `${prefix}_next_game`,
    previous: [1, 2, 3, 4, 5].map((n) => `${prefix}_previous_game_${n}`),
  };
}

/** Validate and normalise a config; throws when nothing is configured. */
export function validateTeamConfig(config: TeamConfig): TeamConfig {
  const previous = Array.isArray(config?.previous)
    ? config.previous.filter((e): e is string => typeof e === "string" && e !== "")
    : [];
  const present =
    !!config &&
    typeof config === "object" &&
    (typeof config.current === "string" ||
      typeof config.next === "string" ||
      Array.isArray(config.previous));
  if (!present) {
    throw new Error("rugby-tracker-team-card: configure at least 'next', 'current' or 'previous'");
  }
  const out: TeamConfig = { ...config, previous: previous.slice(0, MAX_PREVIOUS) };
  if (typeof out.title !== "string") delete out.title;
  if (typeof out.show_header !== "boolean") delete out.show_header;
  return out;
}

const NAME_SUFFIX = /(?:^|\s+)(?:current game|next game|previous game [1-5])\s*$/i;

/** Entity ids in priority order for the header: next, current, previous 1..5. */
function headerEntityIds(config: TeamConfig | undefined): string[] {
  if (!config || typeof config !== "object") return [];
  const previous = Array.isArray(config.previous) ? config.previous.slice(0, MAX_PREVIOUS) : [];
  return [config.next, config.current, ...previous].filter(
    (e): e is string => typeof e === "string" && e !== "",
  );
}

/**
 * The followed team's name: from the sensors' attributes (home_away picks
 * home_team or away_team), else from the first entity's friendly name
 * without its "Current game" / "Next game" / "Previous game N" suffix.
 * Never throws.
 */
export function deriveTeamName(
  states: Record<string, HassEntity | undefined> | undefined,
  config: TeamConfig | undefined,
): string | undefined {
  try {
    const ids = headerEntityIds(config);
    const get = (id: string) => (states && typeof states === "object" ? states[id] : undefined);
    for (const id of ids) {
      const a = get(id)?.attributes;
      if (!a || typeof a !== "object") continue;
      const name =
        a.home_away === "home" ? str(a.home_team) : a.home_away === "away" ? str(a.away_team) : undefined;
      if (name) return name;
    }
    for (const id of ids) {
      const a = get(id)?.attributes;
      const friendly = a && typeof a === "object" ? str(a.friendly_name) : undefined;
      if (!friendly) continue;
      const name = friendly.replace(NAME_SUFFIX, "").trim();
      return name !== "" ? name : undefined;
    }
  } catch {
    // fall through
  }
  return undefined;
}

/** All entity ids the card watches. */
export function teamEntityIds(config: TeamConfig): string[] {
  return [config.current, config.next, ...(config.previous ?? []).slice(0, MAX_PREVIOUS)].filter(
    (e): e is string => typeof e === "string" && e !== "",
  );
}

function formatDate(raw: unknown, locale: string, timeZone: string): string {
  const s = str(raw);
  if (!s) return "–";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return s;
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
            timeZone,
    }).format(d);
  } catch {
    return s;
  }
}

function previousRow(
  entity: HassEntity | undefined,
  locale: string,
  timeZone: string,
): PreviousRow | undefined {
  try {
    if (!entity || entity.state === "unknown" || entity.state === "unavailable") return undefined;
    const a = entity.attributes;
    if (!a || typeof a !== "object") return undefined;
    const opposition = str(a.opposition);
    if (!opposition) return undefined;
    const state = typeof entity.state === "string" ? entity.state : "";
    const m = RESULT.exec(state);
    const outcome = m ? ({ W: "win", L: "loss", D: "draw" } as const)[m[1] as "W" | "L" | "D"] : "unknown";
    return {
      date: formatDate(a.kickoff, locale, timeZone),
      opposition,
      location: typeof a.venue === "string" && a.venue.trim() !== "" ? a.venue.trim() : undefined,
      // The opposition is away when we are home, and vice versa.
      ...rankFields(
        a.home_away === "home" ? a.away_rank : a.home_away === "away" ? a.home_rank : undefined,
        locale,
      ),
      matchUrl: safeMatchUrl(a.match_url),
      score: state || "Result unavailable",
      outcome,
    };
  } catch {
    return undefined;
  }
}

export function buildTeamView(
  states: Record<string, HassEntity | undefined>,
  config: TeamConfig,
  locale: string,
  timeZone: string,
): TeamCardView {
  const get = (id?: string) => (id ? states[id] : undefined);
  const cur = buildView(get(config.current), locale, timeZone);
  const nxt = buildView(get(config.next), locale, timeZone);
  const top =
    cur.mode === "live" ? cur : nxt.mode === "upcoming" ? nxt : buildView(undefined, locale, timeZone);
  const moreInfoEntity = cur.mode === "live" ? config.current : (config.next ?? config.current);
  const previous = (config.previous ?? [])
    .slice(0, MAX_PREVIOUS)
    .map((id) => previousRow(get(id), locale, timeZone))
    .filter((r): r is PreviousRow => r !== undefined);
  const heading =
    config.show_header === false
      ? undefined
      : (str(config.title) ?? deriveTeamName(states, config));
  return { top, previous, heading, moreInfoEntity };
}

type States = Record<string, unknown> | undefined;

export function shouldUpdateTeamCard(
  config: TeamConfig | undefined,
  configChanged: boolean,
  hassChanged: boolean,
  prevStates: States,
  nextStates: States,
): boolean {
  if (!config || configChanged) return true;
  if (hassChanged) return entitiesChanged(prevStates, nextStates, teamEntityIds(config));
  return true;
}

export function teamCardSize(rows: number): number {
  return 2 + Math.min(MAX_PREVIOUS, rows);
}

export function teamStubConfig(states: States): TeamConfig {
  const derived = deriveTeamEntities(pickStubEntity(states));
  return derived
    ? { type: "custom:rugby-tracker-team-card", ...derived }
    : { type: "custom:rugby-tracker-team-card", next: "" };
}

/** Config produced by the editor after a pick: derived entities, or only `next`. Never mutates inputs. */
export function buildEditorConfig(
  picked: string | undefined,
  title: string | undefined,
  type: string | undefined,
  _old: TeamConfig | undefined,
  showHeader?: boolean,
): TeamConfig {
  const config: TeamConfig = { type: type ?? "custom:rugby-tracker-team-card" };
  if (title) config.title = title;
  // show_header defaults to true, so it is only written when turned off.
  if (showHeader === false) config.show_header = false;
  const derived = picked ? deriveTeamEntities(picked) : undefined;
  if (derived) {
    config.current = derived.current;
    config.next = derived.next;
    config.previous = [...derived.previous];
  } else {
    config.next = picked ?? "";
  }
  return config;
}
