# MONKE CITY — Episode 001: The Way In

A short playable introduction to the RichMonke universe, refined in the existing game. The illustrated city, character assets, platforming controller and collision model are retained.

## The episode

1. **Broke:** start outside Monke Motel with $7. Move, jump the broken fence and collect the first $1 on its far side.
2. **A direction:** the Doubter gives a short push toward Monke Stop. RichMonke answers in his own voice.
3. **A bigger world:** the shop owner introduces the $12 city tram ticket, missions, expanding streets and community choices in three boxes. The map, TV and community board are optional, visibly labeled interactions. Leave whenever you like after the introduction.
4. **The reveal:** the existing street screen explains $RICH in two short boxes. ApeOnFone follows with a three-box exchange and Crown Tower camera framing.
5. **Prove it:** spend $12 of fictional game cash at the repurposed street ticket machine. Take the construction street to the overlook. The uninterrupted action section takes about 15 seconds in the deterministic walk-through.
6. **An episode ending:** control pauses; the camera reveals Monke City. Timed story beats lead to Mission 002, locked, and the community/story buttons. Those links do not exist yet, as confirmed by the user, so both show a coming-soon notice.

There is no checkpoint sign, checkpoint notification, checkpoint state or artificial street barrier. Mission objectives guide progress. The ticket is an in-world purchase, not a checkpoint or token transaction. Players can explore past the ticket machine; the objective continues to point to their next meaningful task. The finale requires the core story and a ticket, not optional readings or secrets.

## Controls

- A/D or arrow keys: move.
- Space: jump.
- E: interact.
- Next button, Enter or Space: continue non-choice dialogue.
- Touch: movement and jump buttons, contextual interaction buttons.
- Escape/menu: pause. Optional scenes can be closed; first-time main-story conversations finish through their short dialogue sequence.

The persistent HUD contains only game cash, one objective and banana-coin count. Location titles, objective updates and control hints appear contextually. Speaker names and portraits change when RichMonke replies. Reduced-motion settings suppress secondary animation; the ending can also be skipped to its final card.

## Run and check

Use Node 22.13 or newer. Run `npm install` if dependencies are absent, then:

- `node scripts/dev.mjs` — build and serve at http://127.0.0.1:3000/.
- `node scripts/build.mjs` — static production build into `dist`.
- `node scripts/test.mjs` — gameplay and full-episode integration checks.
- `node node_modules/typescript/bin/tsc --noEmit` — type check.

The server serves rebuilt files without restarting; refresh the browser after a build.

## Existing architecture

`game/content.ts` owns dialogue, mission objectives, collectible placements and encounter purposes. `game/runtime.ts` coordinates story events, shop transitions, the ticket purchase, camera beats and the finale. `game/systems.ts` and `game/gameplay.ts` retain the movement/jump/collision machinery. `GameHUD.tsx` and `GamePanels.tsx` present the episode. `environment.ts`, `worldObjects.ts`, `CharacterArt.ts` and `art.ts` retain the illustrated universe.

The optional WebMCP controls expose the same bounded movement, jump, interaction and dialogue actions as the player; they cannot teleport or grant mission completion. These support browser accessibility and testing.

## Saves and game money

The established `richmonke.mission001.v2` storage key is retained. New payloads use version 3 and migrate supported version-2 saves. Earned cash is reconstructed from valid pickup IDs, with the ticket deducted exactly once when owned. Reloading an interior save places the player outside the shop, preserves discoveries and treats that return as leaving the shop. Old completed saves retain their collectibles but gain the newly required story/ticket objectives.

Cash and banana coins are fictional game progress. They have no real-money value and do not represent the $RICH price. Community voting is a device-local practice vote, clearly labeled. ApeOnFone is a concept cameo; collaboration is not confirmed. Set future official links in `communityLinks` only when supplied.

## Verification

The automated suite walks the entire main path using the real movement controller, jumping real obstacles without teleporting. It verifies the first $7 → $8 reward, both Doubter choices, mandatory story concepts, optional shop readings, ticket affordability and single charging, unrestricted street traversal, the 15–25 second action segment, finale, elevated collectibles, discoveries, local votes and save migration.

Browser play-testing on a separate localhost origin verified movement, jumping, first reward, portrait/speaker changes, the shop introduction, leaving without optional readings, and the $RICH reveal. Continuing that browser test was blocked by automatic approval review reporting a usage limit. Therefore the remaining browser play-through and current-version mobile visual review are not claimed complete. The full episode is verified by the local integration suite. No physical-device performance benchmark was performed.

The site is updated locally. The previously hosted version is not changed by this editing request.

## Artwork

The five compressed environment/character WebP assets are in `public/assets/art/`, totaling about 1.6 MB. The generated walk/run frame pairs use modest stride variations; this is a compact atlas, not a fully rigged character. See `ART-DIRECTION.md` for provenance and asset briefs. No new raster artwork was needed for this narrative refinement.
