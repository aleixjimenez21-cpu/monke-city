import { mission001, type District } from './content';
export type Phase = 'loading' | 'ready' | 'arriving' | 'playing' | 'dialogue' | 'ending' | 'travel' | 'cinematic';
export const missions = [mission001];
export class GameState { phase: Phase = 'loading'; netWorth = 7; paused = false; scene: District = 'street'; flags = new Set<string>(); collected = new Set<string>(); secrets = new Set<string>(); vote: string | null = null; playedSeconds = 0; }
export class Player {
  x = missions[0].startX; velocity = 0; facing = 1; step = 0; y = 662; vy = 0; grounded = true; coyote = .1; jumpBuffer = 0; stumble = 0;
  update(dt: number, direction: number) { this.velocity += (direction * (this.stumble>0?65:155) - this.velocity) * Math.min(1, dt * (direction ? 9 : 13)); this.x = Math.max(90, Math.min(missions[0].worldWidth-100, this.x + this.velocity * dt)); if (direction) this.facing = direction; this.step += Math.abs(this.velocity) * dt * .075; this.stumble=Math.max(0,this.stumble-dt); }
}
export class Camera { x = 0; descent = 1; worldWidth = mission001.worldWidth; shake = 0; zoom = 1; update(dt: number, player: Player, width: number, reduced: boolean) { const target = Math.max(0, Math.min(this.worldWidth - width, player.x - width * (player.facing > 0 ? .37 : .62))); this.x += (target - this.x) * Math.min(1, dt * (reduced ? 15 : 3)); this.shake=Math.max(0,this.shake-dt); } }
export class ParallaxLayer { constructor(public speed: number) {} offset(camera: Camera) { return camera.x * this.speed; } }
export class MissionSystem { current = missions[0]; complete = false; next(flags:Set<string>) { return this.current.objectives.find(o=>!flags.has(o.id)); }  shouldEnd(x: number, flags: Set<string>) { return x >= this.current.endX && this.current.objectives.slice(1).every(o=>o.id==='complete'||flags.has(o.id)); } }
export class SceneTransition { elapsed = 0; reset() { this.elapsed = 0; } update(dt: number) { this.elapsed += dt; return Math.min(1, this.elapsed / 2.2); } }
export class AudioManager {
  enginePitch(speed:number){if(this.muted||!this.context)return;const o=this.context.createOscillator(),g=this.context.createGain();o.type='sawtooth';o.frequency.setValueAtTime(45+speed*55,this.context.currentTime);o.frequency.exponentialRampToValueAtTime(55+speed*85,this.context.currentTime+.2);g.gain.setValueAtTime(.007,this.context.currentTime);g.gain.exponentialRampToValueAtTime(.0001,this.context.currentTime+.3);o.connect(g);g.connect(this.context.destination);o.start();o.stop(this.context.currentTime+.3);}
  context: AudioContext | null = null; muted = true; ambience: OscillatorNode | null = null;
  toggle() { this.muted = !this.muted; if (!this.muted) { this.context ??= new AudioContext(); void this.context.resume(); if(!this.ambience){this.ambience=this.context.createOscillator();const gain=this.context.createGain();gain.gain.value=.002;this.ambience.frequency.value=58;this.ambience.connect(gain);gain.connect(this.context.destination);this.ambience.start();} this.tone(330, .1, .04); } else void this.context?.suspend(); return this.muted; }
  tone(freq: number, duration = .07, volume = .015) { if (this.muted || !this.context) return; const o = this.context.createOscillator(), g = this.context.createGain(); o.type = 'sine'; o.frequency.value = freq; g.gain.setValueAtTime(volume, this.context.currentTime); g.gain.exponentialRampToValueAtTime(.0001, this.context.currentTime + duration); o.connect(g); g.connect(this.context.destination); o.start(); o.stop(this.context.currentTime + duration); }
  footstep() { this.tone(75 + Math.random() * 35, .055, .023); }
  dispose() { void this.context?.close(); }
}
