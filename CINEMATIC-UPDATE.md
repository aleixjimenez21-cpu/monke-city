# RichMonke: cinematic flow and localization

## Implemented

- Live city landing reuses the skyline, street layers and lighting. Ambient motion and cinematic camera movement respect reduced-motion preferences.
- EN/ES selector persists independently of mission progress. Presentation translation covers the landing, HUD, dialogue choices, optional shop subtitles, physical canvas annotations, menu, phone and finale. Brand names and lettering baked into existing artwork remain unchanged.
- Movement, collision, jump physics, pickups, NPC sequence and shop progression are unchanged.
- Completing the route unlocks a physical ringing phone at world x=3240. Answer requires the street scene, grounded player and distance under 100 world units. Keyboard E and the touch button call the same guarded interaction.
- Answer sets a one-shot flag, stops motion and enters a 15-second cinematic: translated call subtitles, camera approach, black car arrival and braking, hinged door opening, automatic character approach and simplified boarding, departure and upward skyline reveal.
- Audio uses the existing opt-in Web Audio system: synthesized phone ring and engine. Muted playback still has all visual cues and subtitles.
- The finale shows social links and REPLAY. Replay clears episode progress but preserves language. An interrupted cinematic resumes at the phone; a finished ride resumes at the finale.

## Asset limitations / pending production assets

The car and phone are lightweight Canvas vector drawings, not imported 3D models. The door animation is procedural. Boarding uses the existing walking sprite and a short fade behind the car; a dedicated hand-to-phone animation and seated/entering-car sprite sequence are pending. No recorded voiceover is included: the requested call is delivered with subtitles. Recorded engine, braking and telephone sound assets are also pending; current sounds are synthesized. These substitutions are implemented, not representations of completed production assets.

## Verification

Run `node node_modules/typescript/bin/tsc --noEmit`, `node scripts/test.mjs` and `node scripts/build.mjs` from the project directory.

The physical simulation test traverses the actual collisions and story gates, with and without optional shop interactions, then checks proximity rejection, one-shot answer, input lock, ride completion, replay, saved progress and interrupted-call recovery. It repeats the route in EN and ES and checks dialogue translation coverage. Browser review exercised the Spanish route from the landing to the phone using player controls, including mobile-width presentation at 390×844, touch answer, subtitles, finale and replay. Desktop landing and finale were also visually reviewed. This is responsive browser validation, not a physical iOS/Android device performance certification.
