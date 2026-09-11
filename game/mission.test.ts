import assert from 'node:assert/strict';
import {Player,GameState,Camera} from './systems';
import {PlayerController,CollectibleSystem,ProgressStore,LocalVoteAdapter} from './gameplay';
import {GameRuntime} from './runtime';
import {encounters,platforms,pickups,mission001} from './content';
const memory=new Map<string,string>();Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>memory.set(k,v),removeItem:(k:string)=>memory.delete(k)},configurable:true});
const dt=1/120;
function settle(g:GameRuntime){for(let i=0;i<300&&g.state.phase!=='playing';i++)g.update(dt,0);assert.equal(g.state.phase,'playing');}
let boxes=0;
function dialogue(g:GameRuntime){while(g.state.phase==='dialogue'){boxes++;g.advance(g.dialogue.node?.choices?.[0].label);}assert.equal(g.state.phase,'playing');}
function walk(g:GameRuntime,target:number){const scene=g.state.scene;let seconds=0;while(Math.abs(g.player.x-target)>4&&g.state.phase!=='ending'&&seconds<30){if(g.state.phase==='dialogue')dialogue(g);if(g.state.phase==='travel'){settle(g);if(g.state.scene!==scene)return;}const dir=Math.sign(target-g.player.x);const obstacle=platforms.some(s=>s.scene===scene&&s.kind!=='ledge'&&((dir>0&&s.x-g.player.x>23&&s.x-g.player.x<92)||(dir<0&&g.player.x-s.x-s.width>23&&g.player.x-s.x-s.width<92)));if(obstacle&&g.player.grounded)g.jump();g.update(dt,dir);seconds+=dt;}assert(seconds<30,'the route must never stall');}
function run(inspect:boolean){boxes=0;const g=new GameRuntime();g.start();settle(g);assert.equal(g.state.netWorth,7);walk(g,450);assert.equal(g.state.netWorth,8,'collect the first dollar before the obstacle');assert(!g.state.flags.has('jump-used'));walk(g,900);assert(g.state.flags.has('doubter'));assert(g.state.flags.has('jumped'));walk(g,1120);settle(g);assert.equal(g.state.scene,'stop');assert.equal(boxes,3,'only three required dialogue boxes');
if(inspect){for(const id of ['map','terminal','rich']){const e=encounters.find(e=>e.id===id)!;walk(g,e.x);for(let i=0;i<150;i++)g.update(dt,0);g.interact();assert.equal(g.dialogue.encounter?.id,id);if(id==='rich')dialogue(g);else g.closeDialogue();}awaitVote(g);}
walk(g,1020);for(let i=0;i<100;i++)g.update(dt,0);g.interact();settle(g);assert.equal(g.state.scene,'street');assert.equal(g.player.x,1350);if(!inspect)for(const flag of ['map','terminal','rich'])assert(!g.state.flags.has(flag),'exhibits are optional');walk(g,3160);assert.equal(g.state.phase,'ending');assert(g.state.flags.has('complete'));assert(g.challengeTime>=10&&g.challengeTime<=15,'final run lasts 10–15 seconds');assert(g.state.playedSeconds<45,'no long empty route');g.save();return g;}
function awaitVote(g:GameRuntime){void g.vote('Harbor');}
const fast=run(false),curious=run(true);assert(pickups.length>=3&&pickups.length<=5);assert.equal(encounters.filter(e=>e.story).length,1);assert.equal(encounters.filter(e=>e.scene==='stop'&&e.kind!=='door').length,3);
for(const e of encounters)for(const n of Object.values(e.nodes??{}))assert(n.text.split(/\s+/).length<=10,'short dialogue');
const controller=new PlayerController();let p=new Player();p.x=500;for(let i=0;i<120;i++)controller.update(p,'street',dt,1);assert(p.x<=537,'fence blocks walking');controller.jump.request(p);for(let i=0;i<190;i++)controller.update(p,'street',dt,1);assert(p.x>638&&p.grounded,'jump clears fence');
for(const item of pickups.filter(i=>i.y<550)){const state=new GameState();state.scene=item.scene;const q=new Player();q.x=item.x;q.y=platforms.find(s=>s.scene===item.scene&&q.x>s.x&&q.x<s.x+s.width)?.y??662;q.grounded=true;controller.jump.request(q);const sys=new CollectibleSystem();for(let i=0;i<120;i++){controller.update(q,state.scene,dt,0);sys.collect(state,q);}assert(state.collected.has(item.id),'all elevated rewards are reachable');}
await curious.vote('Harbor');curious.save();const restored=new GameState(),rp=new Player();assert(new ProgressStore().load(restored,rp));assert.equal(restored.netWorth,curious.state.netWorth);assert.equal(restored.vote,'Harbor');assert(restored.flags.has('complete'));await assert.rejects(()=>new LocalVoteAdapter().save('Moon'));
memory.set(new ProgressStore().key,JSON.stringify({version:3,x:7090,collected:['cash-0'],flags:['ticket','complete'],vote:'Harbor'}));const old=new GameState(),op=new Player();assert(new ProgressStore().load(old,op));assert.equal(op.x,mission001.startX);assert.equal(old.netWorth,7);assert.equal(old.flags.size,0);assert.equal(old.vote,'Harbor');
memory.set(new ProgressStore().key,'{bad');assert(!new ProgressStore().load(new GameState(),new Player()));
const cam=new Camera();cam.update(dt,new Player(),1280,false);assert(cam.x>=0);
console.log('PASS: complete physical playthrough, both skipping and inspecting all exhibits; four rewards; one NPC; short dialogue; reachable jumps; 10–15 second final run; persistence, legacy-save restart and optional vote.');
console.log('Fast-path active gameplay:',fast.state.playedSeconds.toFixed(1),'seconds; final run:',fast.challengeTime.toFixed(1),'seconds.');

