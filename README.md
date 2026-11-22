# Rugby Team Tracker for Home Assistant

[![GitHub Release][releases-shield]][releases]
[![Downloads][downloads-shield]][releases]
[![GitHub Activity][commits-shield]][commits]
[![License][license-shield]](LICENSE)
[![hacs][hacsbadge]][hacs]
[![Integration Usage](https://img.shields.io/badge/dynamic/json?color=41BDF5&style=for-the-badge&logo=home-assistant&label=usage&suffix=%20installs&cacheSeconds=15600&url=https://analytics.home-assistant.io/custom_integrations.json&query=$.rugby_team_tracker.total)](https://analytics.home-assistant.io/)

An **unofficial** Home Assistant integration that follows rugby teams. It gives each team a device with its current, next and previous five games, with league positions and world rankings, plus two bundled Lovelace cards: a game card and a team card.

---

## Support this project

[![Sponsor me on GitHub](https://img.shields.io/badge/Sponsor-craibo%20on%20GitHub-blue.svg?logo=github)](https://github.com/sponsors/craibo)
[![Donate with PayPal](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal)](https://paypal.me/craibo?country.x=AU&locale.x=en_AU)

---

## Features

- **Follow your teams**: pick competitions, then the teams you care about; each team becomes a Home Assistant device
- **Current, next and previous five games**: opposition, kick-off date and time, venue, score and period (Kick off, First Half, Half Time, Second Half, Result, Postponed, Cancelled)
- **League positions and world rankings**: shown after team names (league table for league competitions, World Rugby men's ranking for the Rugby World Cup, Nations Championship and Internationals)
- **Two bundled Lovelace cards**: a game card and a team card (current or next game plus the previous five results), with visual editors and no separate download
- **Light on the data source**: adaptive polling, from every 60 seconds while a followed game is live to every 6 hours when nothing is on (see [Polling and data usage](#polling-and-data-usage))
- **UI-first setup**: everything is configured from Home Assistant; no YAML needed

## Quick Start

Requires Home Assistant 2024.11 or newer.

### Installation via HACS (Recommended)

1. Install [HACS](https://hacs.xyz/docs/use/) if you have not already.
2. [![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=craibo&repository=ha-rugby-team-tracker&category=integration)
   (or in HACS open the menu > **Custom repositories**, add `https://github.com/craibo/ha-rugby-team-tracker` with type **Integration**)
3. Press the **Download** button.
4. Restart Home Assistant.
5. [![Open your Home Assistant instance and start setting up a new integration.](https://my.home-assistant.io/badges/config_flow_start.svg)](https://my.home-assistant.io/redirect/config_flow_start/?domain=rugby_team_tracker)

### Manual installation

1. Download `rugby_team_tracker.zip` from the [latest release][releases], or copy the `custom_components/rugby_team_tracker` folder from this repository.
2. Put the `rugby_team_tracker` folder in your Home Assistant `custom_components` directory.
3. Restart Home Assistant.

### Updating

HACS shows a new version when a [release][releases] is published. Update it there, restart Home Assistant, then hard-refresh your browser (Ctrl+Shift+R) so the cards load the new version. Each release's notes are on the [releases page][releases].

## Setup

1. Go to **Settings > Devices & services > Add integration** and choose **Rugby Team Tracker**.
2. Pick the competitions to follow. Supported:
   - United Rugby Championship
   - Top 14
   - Six Nations
   - Rugby World Cup
   - Gallagher Premiership
   - The Rugby Championship
   - Super Rugby Pacific
   - Nations Championship
   - Internationals
3. Pick the teams to follow (the list is built from the games in those competitions).
4. To change teams later, open the integration and choose **Configure**.

Each followed team becomes a device.

## Entities

Seven sensors per team:

| Entity | State |
|---|---|
| Current game | The period (Kick off, First Half, Half Time, Second Half, Result, Postponed or Cancelled; for example "First Half"), or "No game in progress" |
| Next game | Kick-off date and time (timestamp) |
| Previous game 1 to 5 | Result from the team's side, for example `W 24–17` (1 is the most recent) |

Current game and Previous game 1 to 5 use a rugby ball icon. Next game keeps Home Assistant's default clock icon (it is a timestamp sensor).

Attributes on each (empty for Current game when nothing is live): `opposition`, `home_away`, `kickoff`, `venue`, `home_team`, `away_team`, `home_score`, `away_score`, `period`, `minute` (as reported by the data source; frozen during Half Time), `status`, `match_url`, `logos` (`home` and `away` URLs), `home_rank` and `away_rank` (each team's league-table position or World Rugby ranking, depending on the competition, or none when unknown; see [Ranks](#ranks)), `home_team_url` and `away_team_url` (each team's page on the data source, or none when unknown).

### Ranks

`home_rank` and `away_rank` are each team's current rank, which depends on the game's competition:

- **Rugby World Cup, Nations Championship and Internationals:** the team's World Rugby men's ranking, as published by the data source on its men's world rankings page. Teams are matched by the data source's team slug. Other tournaments that only appear through Internationals (for example the Pacific Nations Cup) also use the world ranking. Teams without a world ranking (for example Gibraltar, or club sides on tour) show nothing.
- **All other competitions:** the team's position in the competition's league table, read from the competition's standings page on the data source. Six Nations and The Rugby Championship use their own tables.

Ranks are refreshed at most hourly (league tables change after each round, world rankings weekly after matches), so they are the ranks as of the last refresh, not the ranks at the time the match was played: a previous result shows where the opposition stands today. A rank is left empty when it is unknown, for example for a team that is not in the table or not ranked.

## Game card

The card is bundled with the integration, which loads it into the frontend as an extra JavaScript module; no manual resource setup is needed (reload the browser after installing). Because it is loaded this way, it does not appear under **Settings > Dashboards > Resources**. Add it from the card picker (it has a visual editor) or in YAML:

```yaml
type: custom:rugby-tracker-game-card
entity: sensor.leinster_next_game
```

It shows both teams with logos, each name followed by the team's rank (league position or world ranking, see [Ranks](#ranks)) in lighter text when known (for example `Leinster 3rd`), and:

- **Upcoming:** kick-off date and time, with the venue (when known) in lighter text under the time.
- **Live:** current score and a period/minute badge (for example `Second Half 63'`); at half-time the badge is just `Half Time`, without a minute.
- **Final:** the final score.

When the card shows a current (live) or previous game, clicking the game block opens the match page on the website in a new browser tab. The website cannot be embedded in Home Assistant (it forbids framing), so a new tab is used. The next game is not clickable.

**Long press:** pressing and holding anywhere on the card opens Home Assistant's more-info dialog for the card's sensor.

Current game is empty when nothing is live, so use a Next game or Previous game sensor for a card that always shows something.

### Markdown card alternative

```yaml
type: markdown
content: >
  {% if has_value('sensor.leinster_next_game') %}
  {% set g = states.sensor.leinster_next_game %}
  **{{ g.attributes.home_team }}** vs **{{ g.attributes.away_team }}**
  {{ as_timestamp(g.state) | timestamp_custom('%a %d %b, %H:%M') }}
  at {{ g.attributes.venue }}
  {% else %}
  No game scheduled
  {% endif %}
```

Replace `sensor.leinster_next_game` with your own entity ID.

## Team card

One card per team: the current game if one is live, otherwise the next game, with the team's previous five results listed underneath. It ships in the same bundle as the game card, so no extra setup is needed. Add it from the card picker or in YAML:

```yaml
type: custom:rugby-tracker-team-card
title: Leinster            # optional, defaults to the team name
show_header: true          # optional, set false to hide the header
current: sensor.leinster_current_game
next: sensor.leinster_next_game
previous:
  - sensor.leinster_previous_game_1
  - sensor.leinster_previous_game_2
  - sensor.leinster_previous_game_3
  - sensor.leinster_previous_game_4
  - sensor.leinster_previous_game_5
```

At least one of `next`, `current` or a non-empty `previous` is required; entries in `previous` beyond five are ignored. Each previous result shows the date, the opposition, its current rank (league position or world ranking) and the venue in brackets (for example `Munster 3rd (Stade de France)`; the rank and venue are in lighter text and left out when unknown), and the score coloured green for a win, red for a loss and amber for a draw. Slots with no game are left out, so a team with fewer than five past games shows fewer rows. With nothing live or scheduled the top block reads "No game". The top block shows ranks after both team names, as in the game card. Ranks use English ordinals (1st, 2nd, 3rd) when Home Assistant's language is English and `#1`, `#2` otherwise.

**Header:** the card starts with a header showing the followed team's name, worked out from the sensors (a trailing "Current game" / "Next game" / "Previous game N" is removed from the sensor name if the attributes are not available). Set `title` to use your own text instead, or `show_header: false` to hide the header. The visual editor has a matching "Show header" toggle.

**Clicks:** everything opens in a new tab on the website.

- In the top block (live or next game), the team logo and name open that team's page, and the middle (date, time and venue, or the score) opens the game page.
- A previous-result row opens its match.
- Anything without a known link stays plain text.

**Long press:** pressing and holding anywhere on the card opens the more-info dialog for the current game sensor while a game is live, otherwise for the next game sensor.

The single-game card keeps its simpler behaviour: the whole block is one link to the match, for live and finished games only. The venue of an upcoming game shows under its kick-off time.

**Visual editor:** pick any one of the team's game sensors and the editor fills in the other six from the entity-id naming (`..._current_game`, `..._next_game`, `..._previous_game_1` to `5`). If you have renamed the entities so they no longer follow that pattern, set the entity ids explicitly in YAML as above. If the sensor you pick does not follow the naming pattern, the editor sets only `next`; add `current` and `previous` in YAML.

## Polling and data usage

Polling is deliberately light: every 60 seconds only while a followed game is live, every 15 minutes when a followed game starts within 2 hours, and every 6 hours otherwise. The 6-hour idle interval is shortened so the integration wakes no later than 2 hours before the next kick-off. A followed game that is past kick-off but not yet flagged live by the data source is also polled every 60 seconds, for up to 3 hours after kick-off, so the start of a match is not missed.

One page is fetched per selected competition, however many teams you follow, and each competition is handled separately: if one page fails, that competition keeps its last known games while the others still update. When every page fails, the integration retries every 5 minutes; entities go unavailable only after 3 consecutive failures, and after that the retry delay doubles (10, 20, then 40 minutes), never waiting longer than the normal polling interval. The normal interval returns as soon as a fetch succeeds.

Ranks add, at most once an hour (the first on start-up) and whatever the polling interval, one standings request per selected league competition, plus one request for the world rankings page when the Rugby World Cup, Nations Championship or Internationals is selected (however many of them). These requests run after the games have been fetched, concurrently, and each gives up after 8 seconds. A failed rank request never affects the entities or the polling: the last known ranks are kept and the request is retried after 10 minutes.

## Known limitations

- The period comes from the data source's own status text (first half, halftime, second half, result). The minute is only used as a fallback for statuses the integration does not recognise (for example extra time), which are treated as First Half up to minute 40 and Second Half after. These values were verified against a real match on 2026-11-15.
- A postponed or cancelled game is not shown in any sensor; the Next game sensor skips to the next playable fixture.
- Champions Cup is not supported yet.
- Relies on page scraping and may stop working if the website changes its pages.

## Support

- **Issues**: report bugs or request features via [GitHub Issues](https://github.com/craibo/ha-rugby-team-tracker/issues). Please include your Home Assistant and integration versions and any relevant log lines.
- **Releases**: [release notes and downloads][releases]
- **Support this project**: [sponsor on GitHub](https://github.com/sponsors/craibo) or [donate with PayPal](https://paypal.me/craibo?country.x=AU&locale.x=en_AU)

## Development

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements_test.txt
.venv/bin/pytest
```

Card (TypeScript and Lit, in `card/`):

```bash
cd card
npm ci
npm run typecheck && npm test
npm run build   # writes custom_components/rugby_team_tracker/www/rugby-tracker-cards.js
```

The built bundle is committed, and CI fails if it is out of date. Release steps are in [docs/RELEASING.md](docs/RELEASING.md).

## Licence

Released under the [MIT License](LICENSE).

The integration uses its own original icon (`custom_components/rugby_team_tracker/brand/`, generated by `scripts/make_icon.py`), which is covered by the same licence.

## Data source and terms

The integration reads publicly available fixture, result, standings and ranking pages from a third-party rugby website, [RugbyPass](https://www.rugbypass.com) (named here once, as a factual reference to where the data comes from). It has no public API, so the integration reads the same public pages a browser would.

- This project is unofficial and is not affiliated with, endorsed by or connected to that website.
- The website's terms of use restrict automated collection of its data and content, and its content belongs to its owners.
- You use this integration at your own risk. You must check and accept the website's terms yourself before using it.
- The pages may change or block access at any time, which would break the integration.

[commits-shield]: https://img.shields.io/github/commit-activity/y/craibo/ha-rugby-team-tracker.svg?style=for-the-badge
[commits]: https://github.com/craibo/ha-rugby-team-tracker/commits/main
[hacs]: https://github.com/hacs/integration
[hacsbadge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[license-shield]: https://img.shields.io/github/license/craibo/ha-rugby-team-tracker.svg?style=for-the-badge
[releases-shield]: https://img.shields.io/github/release/craibo/ha-rugby-team-tracker.svg?style=for-the-badge
[downloads-shield]: https://img.shields.io/github/downloads/craibo/ha-rugby-team-tracker/total.svg?style=for-the-badge
[releases]: https://github.com/craibo/ha-rugby-team-tracker/releases
