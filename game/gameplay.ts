import { Camera, GameState, Player } from './systems';
import { mission001, encounters, pickups, platforms, voteOptions, type District, type Encounter, type Platform, type Node } from './content';

export class JumpSystem {
 request(p:Player){p.jumpBuffer=.14;}
 update(p:Player,dt:number){p.coyote=p.grounded?.1:Math.max(0,p.coyote-dt);p.jumpBuffer=Math.max(0,p.jumpBuffer-dt);let jumped=false;if(p.jumpBuffer>0&&p.coyote>0){p.vy=-620;p.grounded=false;p.coyote=0;p.jumpBuffer=0;jumped=true;}p.vy+=1400*dt;p.y+=p.vy*dt;return jumped;}
}
export class CollisionSystem {
 resolve(p:Player,oldX:number,oldY:number,solids:Platform[]){p.grounded=false;
  for(const s of solids){const overlap=p.x+23>s.x&&p.x-23<s.x+s.width;
   if(overlap&&p.vy>=0&&oldY<=s.y+1&&p.y>=s.y){p.y=s.y;p.vy=0;p.grounded=true;}
   if(s.kind!=='ledge'&&p.y>s.y+4&&p.y-120<s.y+s.height&&overlap){if(oldX+23<=s.x+1){p.x=s.x-23;p.velocity=0;}else if(oldX-23>=s.x+s.width-1){p.x=s.x+s.width+23;p.velocity=0;}}
  }if(p.y>=662){p.y=662;p.vy=0;p.grounded=true;}
 }
}
export class PlayerController {
 jump=new JumpSystem();collision=new CollisionSystem();
 update(p:Player,scene:District,dt:number,direction:number){const ox=p.x,oy=p.y;p.update(dt,direction);const jumped=this.jump.update(p,dt);this.collision.resolve(p,ox,oy,platforms.filter(s=>s.scene===scene));if(scene==='stop')p.x=Math.max(80,Math.min(1090,p.x));return jumped;}
}
export type Particle={x:number;y:number;vx:number;vy:number;life:number;color:string;label?:string};
export class CollectibleSystem {
 particles:Particle[]=[];
 collect(state:GameState,p:Player){const found=pickups.filter(item=>item.scene===state.scene&&!state.collected.has(item.id)&&Math.abs(item.x-p.x)<44&&Math.abs(item.y-(p.y-60))<68);
  for(const item of found){state.collected.add(item.id);if(item.kind==='cash')state.netWorth+=item.value;this.burst(item.x,item.y,item.kind==='cash'?'#b8fb70':'#ffd35e',item.kind==='cash'?`+${item.value}`:'+1 FIND!');}return found;
 }
 burst(x:number,y:number,color:string,label?:string){for(let i=0;i<8;i++)this.particles.push({x,y,vx:Math.cos(i*Math.PI/4)*70,vy:Math.sin(i*Math.PI/4)*55-40,life:.7,color});if(label)this.particles.push({x,y:y-12,vx:0,vy:-35,life:1.3,color,label});}
 update(dt:number){for(const p of this.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.life-=dt;}this.particles=this.particles.filter(p=>p.life>0);}
 count(state:GameState){return pickups.filter(p=>p.kind==='banana'&&state.collected.has(p.id)).length;}
}
export class AchievementSystem { check(state:GameState){if(pickups.filter(p=>p.kind==='banana').every(p=>state.collected.has(p.id))&&!state.flags.has('early-monke')){state.flags.add('early-monke');return true;}return false;} }
export class InteractionSystem { nearest(state:GameState,p:Player){return encounters.filter(e=>e.scene===state.scene&&(!e.requires||e.requires.every(f=>state.flags.has(f)))&&Math.abs(e.x-p.x)<110&&p.grounded).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0]??null;} }
export class NPCSystem { get(scene:District){return encounters.filter(e=>e.scene===scene&&e.kind==='npc');} }
export class DialogueSystem {
 encounter:Encounter|null=null;nodeId='start';
 open(e:Encounter){this.encounter=e;this.nodeId='start';}
 get node():Node|undefined{return this.encounter?.nodes?.[this.nodeId];}
 advance(next?:string){const id=next??this.node?.next;if(id&&this.encounter?.nodes?.[id]){this.nodeId=id;return true;}return false;}
 close(){this.encounter=null;}
}
export class ChoiceSystem { choose(dialogue:DialogueSystem,label:string){const choice=dialogue.node?.choices?.find(c=>c.label===label);if(!choice)throw new Error('Unknown dialogue choice');return dialogue.advance(choice.next);} }
export class InteriorSystem {
 streetX=1120;
 enter(state:GameState,p:Player,camera:Camera){this.streetX=p.x;state.scene='stop';p.x=170;p.y=662;p.vy=0;p.velocity=0;camera.x=0;camera.worldWidth=1180;camera.descent=0;}
 exit(state:GameState,p:Player,camera:Camera){state.scene='street';p.x=1350;p.y=662;p.vy=0;p.velocity=0;camera.worldWidth=mission001.worldWidth;camera.x=Math.max(0,p.x-400);}
}
export interface VoteAdapter { save(choice:string):Promise<{choice:string;scope:'device'}>; }
export class LocalVoteAdapter implements VoteAdapter { async save(choice:string){if(!(voteOptions as readonly string[]).includes(choice))throw new Error('Choose a listed district');return{choice,scope:'device' as const};} }
export class CommunityBoard { constructor(public adapter:VoteAdapter=new LocalVoteAdapter()){} async vote(choice:string,state:GameState){const result=await this.adapter.save(choice);state.vote=result.choice;return result;} }
export class ProgressStore {
 key='richmonke.mission001.v2';
 save(state:GameState,p:Player,streetX:number){try{localStorage.setItem(this.key,JSON.stringify({version:4,x:state.scene==='street'?p.x:streetX,scene:state.scene,insideX:state.scene==='stop'?p.x:null,collected:[...state.collected],flags:[...state.flags],secrets:[...state.secrets],vote:state.vote,playedSeconds:state.playedSeconds}));return true;}catch{return false;}}
 load(state:GameState,p:Player){try{const raw=localStorage.getItem(this.key);if(!raw)return false;const d=JSON.parse(raw);if(![2,3,4].includes(d.version)||!Array.isArray(d.collected)||!Array.isArray(d.flags)||!Number.isFinite(d.x))return false;
  state.collected=new Set(d.collected.filter((id:unknown)=>pickups.some(p=>p.id===id)));state.netWorth=7+pickups.filter(p=>p.kind==='cash'&&state.collected.has(p.id)).reduce((s,p)=>s+p.value,0);
  const validFlags=['stop-entered','stop','left-stop','rich','jumped','doubter','map','terminal','tv','owner','challenge','complete','early-monke','moved','jump-used','interacted'];state.flags=new Set(d.flags.filter((id:unknown)=>validFlags.includes(String(id))));if(d.version===2){state.flags.delete('complete');state.flags.delete('challenge');if(state.flags.has('terminal')){state.flags.add('stop');state.flags.add('stop-entered');state.flags.add('left-stop');}}state.secrets=new Set(Array.isArray(d.secrets)?d.secrets.filter((id:unknown)=>encounters.some(e=>e.kind==='secret'&&e.id===id)):[]);state.vote=(voteOptions as readonly unknown[]).includes(d.vote)?d.vote:null;state.playedSeconds=Number.isFinite(d.playedSeconds)?Math.max(0,d.playedSeconds):0;p.x=Math.max(90,Math.min(mission001.endX,d.x));state.scene='street';if(d.version<4){state.collected.clear();state.netWorth=7;state.flags.clear();p.x=mission001.startX;state.playedSeconds=0;}else if(state.flags.has('stop')){state.flags.add('left-stop');p.x=Math.max(1350,p.x);}return true;
 }catch{return false;}}
 clear(){try{localStorage.removeItem(this.key);}catch{}}
}
