import { build } from 'rolldown';
import { mkdir } from 'node:fs/promises';
await mkdir('work',{recursive:true});
await build({input:'game/mission.test.ts',platform:'node',output:{file:'work/mission-tests.mjs'}});
await import('../work/mission-tests.mjs?run='+Date.now());
