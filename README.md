# MONKE CITY — first playable chapter

Start with $7 outside Monke Motel. Walk through the outskirts, read the road sign, and reach the Downtown overlook. The full journey takes around 45 seconds including the opening and dialogue. Mission #002 is intentionally not implemented.

## Run

Use Node 22.13 or newer. `npm install`, then `npm run dev`. `npm run build` creates the production build.

## Controls

- Desktop: A/D or left/right arrows to move; E to read the nearby sign.
- Mobile: hold the left/right touch buttons; tap READ SIGN.
- Use CONTINUE after the dialogue. Escape or the menu button pauses. Sound is off until enabled explicitly.
- The menu supports restart, story, mission details, and clearly marked project/community placeholders.

## Structure

- `app/page.tsx`: game entry point.
- `game/Game.tsx`: React Game coordinator, GameHUD, DialogueSystem, GameMenu and touch controls.
- `game/systems.ts`: GameState, Player, Camera, ParallaxLayer, InteractionPoint, MissionSystem, SceneTransition and AudioManager.
- `game/environment.ts`: GameScene and all code-drawn environment assets: motel, shops, cars, skyline, Crown Tower, street props and six parallax layers.
- `game/game.css`: game presentation, responsive layouts and reduced-motion treatment.
- `public/assets/character/richmonke.png`: temporary transparent character sprite.

## Replace the character

Replace `public/assets/character/richmonke.png` with a transparent full-body PNG. Character loading and drawing are isolated in `GameScene.load()` and `GameScene.drawPlayer()` in `game/environment.ts`. Adjust the draw dimensions there to retain the replacement's proportions and align its feet to the ground. The temporary representation uses idle breathing and a walking sway; dedicated walking frames can replace that drawing function without changing movement, camera or mission logic. Preserve brown fur, orange/tan face, green black-framed sunglasses and yellow shorts. Chapter 01 has no jewelry.

## Add Mission #002 later

The `missions` array in `game/systems.ts` stores the ID, name, objective, spawn/end coordinates, interaction radius and dialogue, and next-mission link. Add a second definition and a new GameScene district, then extend MissionSystem to select a definition by ID and pass it to the scene/UI instead of the first chapter default. Route the ending action to that definition only when the second district exists. The current prototype intentionally ends with TO BE CONTINUED.

## Asset provenance

Environment art is drawn directly in Canvas. The temporary character was generated with the built-in image-generation tool using the supplied official RichMonke image as its identity reference. Prompt: preserve dark warm brown fur, orange/tan muzzle, vibrant green sunglasses with thick black frames, swept spiky head, stocky cartoon proportions, clean bold linework and yellow/orange shorts; remove chain and all accessories; full-body relaxed standing pose on true transparency. The generated sprite faces left and is flipped in the renderer as needed.

## Prototype scope

No wallet connection, transaction, token price, financial claims, account system or remote player persistence. Audio uses quiet synthesized placeholders. Target is 60 fps using requestAnimationFrame, capped device pixel ratio and delta time. Physical iPhone/Android and browser performance testing are still needed before a public release.

## Build and validation notes

The project retains the Sites React scaffold and accessible Shadcn dialog. On this Windows host, the Vinext runner could not spawn its platform helper. The working default build uses its installed Rolldown bundler directly to produce a static client game; `client.tsx` mounts the same Game used by `app/page.tsx`. `scripts/dev.mjs` builds and serves that output. Restart the dev command after source edits.

Validation: production bundle and TypeScript checks passed. Movement, acceleration/deceleration, bounds, sign proximity, mission completion gate, camera lag and transition checks passed. The local route returned HTTP 200. Browser interaction tests and physical mobile-device tests were not performed. Optional WebMCP read/start tools are feature-detected; no supported WebMCP validation context was available.
