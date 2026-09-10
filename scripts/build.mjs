import { build } from 'rolldown';
import { mkdir, cp, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
await mkdir('dist', { recursive: true });
await build({ input: 'client.tsx', platform: 'browser', resolve: { alias: { '@': resolve('.') } }, transform: { jsx: { runtime: 'automatic' }, define: { 'process.env.NODE_ENV': JSON.stringify('production') } }, output: { dir: 'dist', entryFileNames: 'game.js', assetFileNames: '[name][extname]', minify: true } });
await cp('game/game.css','dist/game.css');
await cp('public', 'dist', { recursive: true });
await writeFile('dist/index.html', '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#11182c"><meta name="description" content="Start with $7. Enter Monke City. A playable RICHMONKE story."><title>MONKE CITY — A RICHMONKE Story</title><link rel="icon" href="/favicon.svg"><link rel="stylesheet" href="/game.css"></head><body><div id="root"></div><script type="module" src="/game.js"></script></body></html>');
console.log('Built MONKE CITY static game in dist/');
