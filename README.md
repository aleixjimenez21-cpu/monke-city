# MONKE CITY — Mission 001: Playable introduction

Compression and pacing pass on the existing RichMonke game. Illustrated assets, movement, jumping, dialogue, HUD, touch controls and mission systems are retained.

## The compact episode

1. Black opening: $7, Monke Motel, Mission 001, Start Journey. Control begins 0.35 seconds after starting.
2. First dollar before the fence: $7 → $8, jump, then the Doubter. One required NPC, three short dialogue boxes, either reply works.
3. Monke Stop: a physical wall map, a working CRT, a cork notice board, a monkey shopkeeper and a small checkout display. All five interactions are optional. A short subtitle accompanies the world, rather than opening an information menu. The community practice vote remains behind an optional disclosure.
4. Leave through the right-hand city exit. A short run with two jumps, a puddle and two banana coins leads directly to the overlook.
5. Crown Tower reveal, Mission 001 complete, started with $7, the unwritten future. The final card appears after six seconds, with Mission 002 locked and community/story buttons. Official links do not exist yet; buttons show “Official links coming soon.”

The street is 3,550 units wide, down from 7,600. There are four collectibles total: the first dollar, elevated shop cash, a jump coin and the final route coin. The ticket detour, repeated street explanations, extra NPC conversations and filler encounters are removed.

The intended first-visit experience is roughly 60–90 seconds including learning controls, reading and exploration. This is a design target, not a measured user-study result or an enforced minimum. A practiced player can finish faster. The deterministic full route takes 23.4 seconds of active gameplay, with an 11.5-second final run; dialogue, player reading and the ending are additional.

## Controls

- A/D or arrow keys: move. Space: jump. E: inspect.
- Next, Enter or Space: continue non-choice dialogue.
- Touch movement, jump and contextual interaction buttons remain available.
- Escape/menu: pause. Optional readings can be closed immediately.

## Run and verify

Use Node 22.13 or newer. Install dependencies if absent, then:

- `node scripts/dev.mjs` — build and serve on http://127.0.0.1:3000/.
- `node scripts/build.mjs` — production build into `dist`.
- `node scripts/test.mjs` — physical full-route integration checks.
- `node node_modules/typescript/bin/tsc --noEmit` — type check.

The running server serves rebuilt files; refresh after a build.

## Verification

The automated suite completes the mission through the real physics controller without teleporting, both skipping and inspecting all five shop interactions. It checks reward order, required story length, collision and reachable jumps, final-run timing, optional voting, persistence and legacy-save handling.

Browser playthrough completed the motel, first reward, Doubter, all three exhibits, elevated cash, final jumps, both banana coins and ending. The redesigned shop, map focus, TV broadcast, local vote, shopkeeper, $RICH display, exit and 390 × 844 mobile inspection layout were checked in the browser. Build and TypeScript checks pass. No physical-device performance benchmark or first-time user timing study was performed.

## Persistence and configuration

The established `richmonke.mission001.v2` local-storage key is retained, with version-4 payloads. Version-2/3 journeys restart at the motel because positions and rewards changed; an existing valid community vote is preserved. Current saves restore earned cash from valid collectible IDs. Interior reloads resume outside the shop, with discoveries retained.

Cash and coins are fictional game progress. The existing practice vote is device-local. Configure `communityLinks` in `game/content.ts` when official URLs are supplied.

`game/content.ts` owns pacing, placements and copy. `runtime.ts` handles transitions, objectives and ending. `systems.ts` and `gameplay.ts` retain physics and interactions; the existing renderers and art atlas remain in use. WebMCP offers the same bounded controls as the player and cannot teleport or grant completion.

This edit is local; it does not update the previously published site. See `ART-DIRECTION.md` for artwork provenance. The interior and shopkeeper were generated with the built-in image tool; prompts and asset paths are recorded in `MONKE-STOP-ART.md`.

## Monke Stop interior redesign

The existing scene now uses a compact illustrated shop background. There are no freestanding information panels. The map and notice-board annotations are drawn directly on their physical surfaces; TV frames play inside its CRT glass. The shopkeeper is a separate alpha sprite masked behind the counter. Lighting, CRT scanlines, fridge glints, coffee steam, plants and the shopkeeper have restrained animation, disabled under reduced motion.

The existing dialogue/interact logic drives short in-world inspections: map 2.5s, TV 4s, board 3s, shopkeeper 4.2s over three lines, and checkout 3.4s over two lines. Next or Escape lets the player leave sooner. Opening the optional practice vote holds its inspection timer until the choice UI is closed. A visit inspecting everything is designed around 15–25s including movement; no minimum visit time is enforced.

Physics, RichMonke’s character assets, street story, collectibles, money and episode finale are retained. StoreScene.ts handles the new interior rendering. Save payload version 4 remains compatible, with the additional optional shop discoveries whitelisted.
