# Monke Stop art — September 2026

Generated with the built-in image generation tool. No API/CLI fallback used.

Final integrated assets:
- `public/assets/art/monke-stop.webp` — 1536 × 1024, quality-90 WebP.
- `public/assets/art/shopkeeper.webp` — transparent, trimmed and resized to 650px high, quality-90 WebP.

The original generated PNGs remain in the default generated-images directory. Only the workspace copies are referenced by the game. RichMonke’s original sprite atlas is unchanged.

## Environment prompt

Use case: illustration-story. Create a production background for the existing RichMonke 2D cartoon videogame, a cozy compact MONKE STOP convenience store at night. Landscape 1536x1024, straight-on side-scrolling game camera, clean bold dark navy cartoon outlines, beautiful warm orange lamplight and deep navy shadows, banana yellow and subtle mint green neon, polished hand-painted animated-film quality. No people or monkeys (animated characters added separately). Floor is a clear playable strip in bottom 25%, no obstacles on floor. Wall objects and furnishings mostly above 70% height. Composition: far left glass entrance with blue city outside; left drink fridge with colorful illustrated bottles and a small banana snack shelf; at x26% y44% a physical folded illustrated city map pinned to the wall with a winding route and small crown destination, no text; at x44% y50% an old wooden CRT television on a low shelf, dark empty screen; at x61% y43% a modest cork notice board with small pinned paper notes, district sketches, photos and stickers but no text. Center top at x45% y19% ONE main curved enamel illuminated shop sign, exact text MONKE STOP. Right x76% y66% a beautiful wooden checkout counter with copper edge, a small dark green customer screen on its top at x80% y54%, a cash register and coffee machine at x71%; leave open space behind the counter for a monkey shopkeeper to be composited later. Far right x91% glass exit door with green arrow toward city. Add two hanging lamps, small plants, a few illustrated snack packs and magazines without readable text, a couple of subtle banana logo stickers. Good composition with wall breathing room, layered light reflections on tiled floor, rich tactile materials. Only readable wording MONKE STOP, no motivational phrases, no website panels or floating cards, no HUD, no oversized information displays. The map, corkboard and TV are small integrated shop props, each a different shape and material, with space between them. Keep silhouette scale of furnishings consistent with a small side-view cartoon monkey game.

## Shopkeeper prompt

Use case: illustration-story. Production 2D cartoon character sprite on a genuinely transparent background, one character only, full body, no shadow backdrop or environment. A memorable older monkey convenience-store shopkeeper for RichMonke's Monke City game. Broad compact body, shaggy gray-brown cheek tufts, warm amber face, large expressive friendly eyes WITHOUT sunglasses, small rounded ears, crooked friendly grin. Faded teal shop cap with a tiny banana patch, rolled cream short sleeves and burnt-orange canvas apron with a pocket, dark trousers. Holds a small glass in one hand and a folded polishing cloth in the other, casually cleaning it. Three quarter view facing left, welcoming relaxed pose. Bold clean dark navy cartoon outlines, polished hand-painted cartoon videogame quality, warm orange light from top left, soft navy cel shadows, subtle green reflected light. Distinct from RichMonke, no gold chain, no yellow shorts, no text. Entire cap and feet visible with transparent padding, no extra poses. 1024x1024.

## Integration

The generated room was composed to the existing 1180 × 800 interior world. Physical map labels, pinned mission notes and screen content are code-rendered to remain exact, animate and support game state. The shopkeeper's lower body is masked behind the counter. The supplied full-body character image has real alpha. Rendering keeps existing movement/collision coordinates and collectible IDs.
