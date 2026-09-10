import assert from 'node:assert/strict';
import { Player, GameState, Camera } from './systems';
import { PlayerController, CollectibleSystem, ProgressStore, AchievementSystem, LocalVoteAdapter } from './gameplay';
import { GameRuntime } from './runtime';
import { encounters, platforms, pickups, mission001 } from './content';
const memory=new Map<string,string>();Object.defineProperty(globalThis,'localStorage',{value:{getItem:(k:string)=>memory.get(k)??null,setItem:(k:string,v:string)=>memory.set(k,v),removeItem:(k:string)=>memory.delete(k)},configurable:true});
const dt=1/120;
function step(g:GameRuntime,seconds:number,direction=0){for(let i=0;i<seconds/dt;i++)g.update(dt,direction);}
function open(g:GameRuntime,id:string){const e=encounters.find(e=>e.id===id)!;g.state.scene=e.scene;g.player.x=e.x;g.player.y=662;g.player.vy=0;g.player.grounded=true;g.setPhase('playing');g.interact();assert.equal(g.dialogue.encounter?.id,id);}
function finish(g:GameRuntime){let count=0;while(g.state.phase==='dialogue'&&count++<20){g.advance(g.dialogue.node?.choices?.[0].label);}assert.equal(g.state.phase,'playing');}
let p=new Player(),controller=new PlayerController();for(let i=0;i<120;i++)controller.update(p,'street',dt,1);assert(p.velocity>150);const x=p.x;for(let i=0;i<120;i++)controller.update(p,'street',dt,0);assert(p.velocity<.01);assert(p.x-x<13);
p=new Player();p.x=620;for(let i=0;i<120;i++)controller.update(p,'street',dt,1);assert(p.x<=652);controller.jump.request(p);let lowest=662;for(let i=0;i<190;i++){controller.update(p,'street',dt,1);lowest=Math.min(lowest,p.y);}assert(lowest<540);assert(p.x>753);assert(p.grounded);assert.equal(p.y,662);
// Every raised collectible has a physically reachable jump from its support.
for(const id of ['banana-1','banana-2','banana-3','banana-5']){const item=pickups.find(i=>i.id===id)!;const state=new GameState();state.scene=item.scene;const q=new Player();q.x=item.x;const support=platforms.filter(s=>s.scene===item.scene&&q.x>s.x&&q.x<s.x+s.width).sort((a,b)=>a.y-b.y)[0];q.y=support?.y??662;q.grounded=true;controller.jump.request(q);const sys=new CollectibleSystem();for(let i=0;i<120;i++){controller.update(q,state.scene,dt,0);sys.collect(state,q);}assert(state.collected.has(id),id+' must be reachable');}
const g=new GameRuntime();g.init();g.start();step(g,1.8);assert.equal(g.state.phase,'playing');
for(const [x,want]of [[440,8],[520,10],[595,11]]){g.player.x=x;g.player.y=662;step(g,.05);assert.equal(g.state.netWorth,want);}step(g,.5);assert.equal(g.state.netWorth,11,'cash cannot be collected twice');
open(g,'doubter');g.advance();assert.equal(g.dialogue.nodeId,'start','a choice is required');g.advance('WHAT DO I NEED?');assert.equal(g.dialogue.nodeId,'need');finish(g);assert(g.state.flags.has('doubter'));
const alternate=new GameRuntime();open(alternate,'doubter');alternate.advance('WATCH ME.');assert.equal(alternate.dialogue.nodeId,'watch');finish(alternate);assert(alternate.state.flags.has('doubter'));
g.player.x=1405;g.interact();assert.equal(g.state.phase,'travel');step(g,.8);assert.equal(g.state.scene,'stop');assert.equal(g.state.phase,'playing');
for(const id of ['tv','terminal']){open(g,id);finish(g);assert(g.state.flags.has(id));}open(g,'map');g.closeDialogue();assert(g.state.flags.has('map'));
g.player.x=110;g.interact();step(g,.8);assert.equal(g.state.scene,'street');assert.equal(g.player.x,1405);
open(g,'ape');finish(g);assert(g.state.flags.has('ape'));open(g,'board');await g.vote('Harbor');assert.equal(g.state.vote,'Harbor');g.closeDialogue();assert(g.state.flags.has('board'));await assert.rejects(()=>new LocalVoteAdapter().save('Moon'));
const gate=new GameRuntime();gate.setPhase('playing');gate.player.x=4470;step(gate,.05,1);assert.equal(gate.player.x,4450);assert(gate.notice.includes('Before the run'));
g.state.flags.add('jumped');assert(g.mission.canChallenge(g.state.flags));g.player.x=5180;g.player.y=662;g.player.grounded=true;g.player.velocity=100;step(g,.05,1);assert(g.player.stumble>0);assert.equal(g.state.phase,'playing');const cash=g.state.netWorth;step(g,1);assert.equal(g.player.stumble,0);assert.equal(g.state.netWorth,cash,'hazards do not charge cash');
g.player.x=6550;step(g,.05);assert(g.state.flags.has('challenge'));g.player.x=mission001.endX;step(g,.05);assert(g.state.flags.has('complete'));assert.equal(g.state.phase,'ending');
for(const item of pickups.filter(i=>i.kind==='banana'))g.state.collected.add(item.id);const achievement=new AchievementSystem();assert(achievement.check(g.state));assert(!achievement.check(g.state),'achievement only once');g.save();const restored=new GameState(),rp=new Player();assert(new ProgressStore().load(restored,rp));assert.equal(restored.netWorth,g.state.netWorth);assert.equal(restored.vote,'Harbor');assert(restored.flags.has('complete'));assert.equal(new CollectibleSystem().count(restored),5);
memory.set(new ProgressStore().key,'{bad');assert.equal(new ProgressStore().load(new GameState(),new Player()),false);
memory.set(new ProgressStore().key,JSON.stringify({version:2,x:999999,collected:['fake','cash-0','cash-0'],flags:['fake'],vote:'Moon'}));const sanitized=new GameState(),sp=new Player();assert(new ProgressStore().load(sanitized,sp));assert.equal(sanitized.netWorth,8);assert.equal(sp.x,7090);assert.equal(sanitized.vote,null);assert.equal(sanitized.flags.size,0);
const camera=new Camera();camera.update(dt,new Player(),1280,false);assert(camera.x>=0);
console.log('PASS: acceleration, stopping, fence collision, jumping, raised collectibles, exact cash progression, both dialogue choices, interior entry/exit, all discoveries, prototype voting, objective gate, hazard recovery, mission ending, achievement, persistence and save sanitization.');

