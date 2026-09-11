# MONKE CITY — upgraded Mission 001

This extends the existing RichMonke game. The original sprite, motel, city drawing, parallax, loading sequence, directional movement, sound controls and responsive presentation remain in place.

## Play

- A / D or left / right arrows: move.
- SPACE: jump. Jumping includes a short input buffer and coyote time.
- E: interact with a nearby person, object or door.
- Mobile: hold the direction buttons, tap JUMP, and tap the contextual interaction button. Movement and jumping support simultaneous touches.
- Escape / menu: pause. Progress saves locally. Restart clears only this mission's local save.

The exploration route is designed for roughly 3–5 minutes of reading, discovery and play. These are pacing targets, not enforced timers. A fast player can finish sooner.

## Mission route

1. Collect nearby fictional Monke Cash: $7 → $8 → $10 → $11. Jump the broken fence.
2. Meet the Doubter and choose WATCH ME or WHAT DO I NEED.
3. Enter Monke Stop. Discover the TV transmission, district map and community terminal. The store supports walking, jumping, shelf platforms and a hidden banana.
4. Explore the alley, poster and strange vending machine. Find more cash and collectibles.
5. Meet the placeholder ApeOnFone at the bench. His phone encounter focuses on the story, not financial returns. It is a concept encounter, not a confirmed collaboration.
6. Read the mission board. Choose a future district in a device-local prototype vote. No live vote totals or backend are presented.
7. Cross the construction section: three obstacles, a puddle and a moving cart. Hits cause only a brief stumble; no death or cash penalty.
8. Reach the Crown Tower overlook. The final sequence reports actual collected cash, bananas and fictional story access. Mission 002 remains locked.

Five bananas unlock EARLY MONKE. There are three optional secrets. Collecting every cash pickup yields $23; the ending reports the player's actual total rather than inventing a fixed result. All game currency and collectibles have no real-world monetary value.

## Run and validate

Use Node 22.13 or newer. Dependencies already exist in this checkout.

- `npm run dev` builds and serves the game on port 3000.
- `npm run build` builds static production output.
- `node scripts/test.mjs` runs the deterministic mission and gameplay checks.
- `node node_modules/typescript/bin/tsc --noEmit` checks types.

On this Windows workspace, `node scripts/dev.mjs` and `node scripts/build.mjs` can run directly if the npm launcher is unavailable. The existing lightweight Rolldown build is preserved. Restart the preview command after source edits, or rebuild and refresh the browser when the existing static server is already running.

## Architecture

- `client.tsx` and `app/page.tsx`: existing entrypoints, both using the same Game.
- `game/Game.tsx`: canvas lifecycle, keyboard/touch input and existing opening presentation.
- `game/systems.ts`: existing Player, Camera, GameState, MissionSystem, SceneTransition, ParallaxLayer and AudioManager, extended for the new chapter.
- `game/gameplay.ts`: PlayerController, JumpSystem, CollisionSystem, CollectibleSystem, AchievementSystem, NPCSystem, InteractionSystem, DialogueSystem, ChoiceSystem, InteriorSystem, CommunityBoard, VoteAdapter and ProgressStore.
- `game/runtime.ts`: coordinates scene changes, interactions, mission progression, saves and game events.
- `game/content.ts`: mission objectives, encounters, dialogue branches, platforms, pickups, vote choices and future official links.
- `game/environment.ts`: retained city artwork and RichMonke renderer.
- `game/worldObjects.ts`: new obstacles, NPC placeholders, collectibles, mission board, construction area and store interior.
- `game/GameHUD.tsx`: cash, collectibles, next objective and contextual prompts.
- `game/GamePanels.tsx`: discoveries, map, dialogue choices, board, pause and ending.
- `game/game.css`: original presentation plus responsive upgrade styles.
- `game/mission.test.ts`: headless gameplay/integration tests.

## Assets and extension points

The RichMonke sprite remains at `public/assets/character/richmonke.png`, unchanged. Replace it with approved full-body transparent artwork and adapt `GameScene.drawPlayer()` when dedicated idle/walk/jump frames arrive. Original built-in image generation used the supplied official character reference, preserving fur, face, green sunglasses, yellow shorts and cartoon identity while removing jewelry.

Environment assets are code-drawn in `game/environment.ts` and `game/worldObjects.ts`. The interior shares the same renderer and sprite. ApeOnFone's drawn NPC is explicitly temporary.

To add the next chapter later, create another mission definition using `game/content.ts`, provide its scene content and select that mission in MissionSystem. The chapter-one orchestrator remains isolated in `game/runtime.ts`; other renderers and generic gameplay systems do not need rebuilding. No next district is playable yet.

Set the approved X/story and Telegram/community URLs in `communityLinks` in `game/content.ts`. Until then, CTA buttons show an honest coming-soon message. Replace `LocalVoteAdapter` with an authenticated backend adapter when real community voting is available; do not relabel it live until that service is connected.

Saves use `richmonke.mission001.v2` in localStorage. Pickup IDs are deduplicated and validated; cash is recomputed from collected items. Unsupported, malformed and unavailable storage fail gracefully. Resuming an interior save returns to the store's street entrance while retaining discoveries and collectibles.

## Verification and limits

Production bundle and TypeScript checks pass. Tests cover movement, jump and collision, reachable elevated collectibles, exact cash progression, both NPC branches, required discoveries, store entry/exit, voting, incomplete-objective checkpoint, hazard recovery, ending, achievement, persistence and malformed saves. The local HTTP route responds successfully.

Browser interaction tests, physical iPhone/Android tests, visual QA and measured frame-rate/pacing tests have not been performed. The existing optional WebMCP read/start tools are retained and updated; no supported WebMCP validation context was available. This upgrade is prepared locally; the already published initial version is not changed by the editing request alone.

## Illustrated edition (visual upgrade)

The existing mission, dialogue text, triggers, collectible positions, collision geometry, movement physics and save format are unchanged. Presentation now uses compressed illustrated skyline, transparent storefronts, a warm shop interior, six distinct dressed NPCs and a nine-pose RichMonke atlas. Character drawing includes pose selection, breathing, stride bounce, jump/landing squash, interaction poses, rim lighting and dust. UI includes original banana-coin SVGs, object-positioned prompts and portrait dialogue panels.

Art files are in `public/assets/art/` (about 1.6 MB combined). Source bounds for each character are explicit in `game/art.ts` because the generated atlas is not a perfectly regular grid. The original character remains as a load fallback. The walk/run pose pairs have modest stride differences; this is a compact atlas animation rather than a fully rigged production character. Reduced-motion settings disable secondary animation. Decorative backgrounds and NPCs do not add collision surfaces or interactions. ApeOnFone remains a concept placeholder with the existing disclosure.

Validation: existing automated mission suite passes; TypeScript and production build pass. Browser visual inspection covered the motel, portrait dialogue at desktop and 390×844, and shop interior. This is not a performance benchmark on physical mobile hardware. Rendering checks used a separate disposable harness without modifying the player's saved game.

See `ART-DIRECTION.md` for asset briefs and generation provenance.
