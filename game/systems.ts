export type Phase = 'loading' | 'intro' | 'ready' | 'arriving' | 'playing' | 'dialogue' | 'ending';
export const missions = [{ id: '001', name: 'Get into Monke City', objective: 'Follow the road toward Downtown', startX: 370, endX: 4430, interaction: { x: 3730, radius: 150, title: 'MONKE CITY', subtitle: '3 KM →', lines: ['Everybody wants in.', 'Few make it.'] }, nextMission: null }];
export class GameState { phase: Phase = 'loading'; netWorth = 7; paused = false; signRead = false; }
export class Player {
  x = missions[0].startX; velocity = 0; facing = 1; step = 0;
  update(dt: number, direction: number) { this.velocity += (direction * 110 - this.velocity) * Math.min(1, dt * (direction ? 9 : 13)); this.x = Math.max(170, Math.min(4470, this.x + this.velocity * dt)); if (direction) this.facing = direction; this.step += Math.abs(this.velocity) * dt * .075; }
}
export class Camera { x = 0; descent = 1; update(dt: number, player: Player, width: number, reduced: boolean) { const target = Math.max(0, Math.min(4800 - width, player.x - width * (player.facing > 0 ? .37 : .62))); this.x += (target - this.x) * Math.min(1, dt * (reduced ? 15 : 3)); } }
export class ParallaxLayer { constructor(public speed: number) {} offset(camera: Camera) { return camera.x * this.speed; } }
export class InteractionPoint { config = missions[0].interaction; nearby(x: number) { return Math.abs(x - this.config.x) < this.config.radius; } }
export class MissionSystem { current = missions[0]; complete = false; shouldEnd(x: number, read: boolean) { return x >= this.current.endX && read; } }
export class SceneTransition { elapsed = 0; reset() { this.elapsed = 0; } update(dt: number) { this.elapsed += dt; return Math.min(1, this.elapsed / 2.2); } }
export class AudioManager {
  context: AudioContext | null = null; muted = true; ambience: OscillatorNode | null = null;
  toggle() { this.muted = !this.muted; if (!this.muted) { this.context ??= new AudioContext(); void this.context.resume(); if(!this.ambience){this.ambience=this.context.createOscillator();const gain=this.context.createGain();gain.gain.value=.002;this.ambience.frequency.value=58;this.ambience.connect(gain);gain.connect(this.context.destination);this.ambience.start();} this.tone(330, .1, .04); } else void this.context?.suspend(); return this.muted; }
  tone(freq: number, duration = .07, volume = .015) { if (this.muted || !this.context) return; const o = this.context.createOscillator(), g = this.context.createGain(); o.type = 'sine'; o.frequency.value = freq; g.gain.setValueAtTime(volume, this.context.currentTime); g.gain.exponentialRampToValueAtTime(.0001, this.context.currentTime + duration); o.connect(g); g.connect(this.context.destination); o.start(); o.stop(this.context.currentTime + duration); }
  footstep() { this.tone(75 + Math.random() * 35, .055, .023); }
  dispose() { void this.context?.close(); }
}
