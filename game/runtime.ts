import { AudioManager, Camera, GameState, MissionSystem, Player, SceneTransition, type Phase } from './systems';
import { AchievementSystem, ChoiceSystem, CollectibleSystem, CommunityBoard, DialogueSystem, InteriorSystem, InteractionSystem, PlayerController, ProgressStore } from './gameplay';
import { mission001 } from './content';
export class GameRuntime {
 state=new GameState();player=new Player();camera=new Camera();audio=new AudioManager();transition=new SceneTransition();mission=new MissionSystem();
 controller=new PlayerController();collectibles=new CollectibleSystem();achievements=new AchievementSystem();interactions=new InteractionSystem();dialogue=new DialogueSystem();choices=new ChoiceSystem();interior=new InteriorSystem();board=new CommunityBoard();store=new ProgressStore();
 phaseTime=0;time=0;notice='';noticeTime=0;achievementTime=0;hasSave=false;travelTarget:'stop'|'street'='stop';travelChanged=false;lastFoot=0;saveClock=0;challengeTime=0;hitCooldown=0;reduced=false;viewWidth=1280;
 init(){this.hasSave=this.store.load(this.state,this.player);}
 setPhase(phase:Phase){this.state.phase=phase;this.phaseTime=0;this.transition.reset();}
 tell(message:string,seconds=3){this.notice=message;this.noticeTime=seconds;}
 save(){if(['loading','intro','ready'].includes(this.state.phase)&&this.state.flags.size===0)return;this.store.save(this.state,this.player,this.interior.streetX);}
 start(resume=false){if(!resume){this.state=new GameState();this.player=new Player();this.camera=new Camera();this.store.clear();this.hasSave=false;}this.state.paused=false;this.camera.descent=resume?0:1;this.camera.x=Math.max(0,this.player.x-this.viewWidth*.37);this.setPhase(resume&&this.state.flags.has('complete')?'ending':'arriving');}
 reset(){this.state=new GameState();this.player=new Player();this.camera=new Camera();this.dialogue.close();this.collectibles.particles=[];this.hasSave=false;this.store.clear();this.notice='';this.setPhase('ready');}
 jump(){if(this.state.phase==='playing'&&!this.state.paused)this.controller.jump.request(this.player);}
 mark(flag:string){if(this.state.flags.has(flag))return;this.state.flags.add(flag);this.save();if(['jumped','doubter','terminal','ape','board','challenge'].includes(flag)){this.tell('MISSION UPDATED · '+(this.mission.next(this.state.flags)?.label??'Mission complete'),3.5);this.audio.tone(523,.22,.025);}}
 interact(){if(this.state.phase!=='playing'||this.state.paused)return;const e=this.interactions.nearest(this.state,this.player);if(!e)return;this.player.velocity=0;this.state.flags.add('interacted');this.audio.tone(440,.12,.025);
  if(e.kind==='door'){this.travelTarget=e.id==='exit'?'street':'stop';this.travelChanged=false;this.setPhase('travel');return;}
  this.dialogue.open(e);this.setPhase('dialogue');
 }
 advance(choice?:string){if(this.state.phase!=='dialogue'||(!choice&&this.dialogue.node?.choices))return;const continued=choice?this.choices.choose(this.dialogue,choice):this.dialogue.advance();this.audio.tone(320,.05,.015);if(!continued)this.closeDialogue();}
 closeDialogue(){const e=this.dialogue.encounter;if(!e)return;const finished=!this.dialogue.node?.next&&!this.dialogue.node?.choices;if(e.flag&&finished)this.mark(e.flag);if(e.kind==='secret'&&finished){this.state.secrets.add(e.id);this.tell(`SECRET FOUND · ${this.state.secrets.size} / 3`);this.collectibles.burst(this.player.x,this.player.y-100,'#d2b4ff');}this.dialogue.close();this.setPhase('playing');this.save();}
 async vote(choice:string){await this.board.vote(choice,this.state);this.save();this.audio.tone(660,.16,.025);}
 update(dt:number,direction:number){if(this.state.paused)return;this.time+=dt;this.phaseTime+=dt;this.noticeTime=Math.max(0,this.noticeTime-dt);this.achievementTime=Math.max(0,this.achievementTime-dt);this.hitCooldown=Math.max(0,this.hitCooldown-dt);this.collectibles.update(dt);
  switch(this.state.phase){
   case'loading':if(this.phaseTime>.65)this.setPhase(this.hasSave?'ready':'intro');break;
   case'intro':if(this.phaseTime>4.5)this.setPhase('ready');break;
   case'arriving':this.camera.descent=this.reduced?0:Math.pow(1-Math.min(1,this.phaseTime/1.65),3);if(this.phaseTime>1.65){this.camera.descent=0;this.setPhase('playing');}break;
   case'travel':if(this.phaseTime>.28&&!this.travelChanged){this.travelChanged=true;if(this.travelTarget==='stop')this.interior.enter(this.state,this.player,this.camera);else this.interior.exit(this.state,this.player,this.camera);this.save();}if(this.phaseTime>.65)this.setPhase('playing');break;
   case'playing':this.updatePlay(dt,direction);break;
   case'dialogue':{const effect=this.dialogue.node?.effect;if(effect==='crown'&&!this.reduced){this.camera.x+=(Math.max(0,this.player.x-this.viewWidth*.25)-this.camera.x)*dt;this.camera.zoom+=(1.04-this.camera.zoom)*dt;}break;}
   case'ending':{if(this.phaseTime<1.4)this.player.x+=dt*35;this.player.facing=1;this.camera.x+=(Math.max(0,mission001.worldWidth-this.viewWidth)-this.camera.x)*Math.min(1,dt*.7);this.camera.zoom+=(1.065-this.camera.zoom)*dt*.4;break;}
  }
 }
 updatePlay(dt:number,direction:number){this.state.playedSeconds+=dt;const p=this.player;const jumped=this.controller.update(p,this.state.scene,dt,direction);if(jumped){this.state.flags.add('jump-used');this.audio.tone(245,.12,.02);}if(direction)this.state.flags.add('moved');
  if(this.state.scene==='street'&&p.x>780&&p.grounded&&this.state.flags.has('jump-used'))this.mark('jumped');
  const found=this.collectibles.collect(this.state,p);if(found.length){this.audio.tone(found.some(i=>i.kind==='banana')?880:660,.17,.03);this.save();if(this.achievements.check(this.state)){this.achievementTime=4;this.audio.tone(1046,.5,.025);this.save();}}
  if(this.state.scene==='street'){
   if(p.x>4450&&!this.mission.canChallenge(this.state.flags)){p.x=4450;p.velocity=0;if(this.noticeTime<=0)this.tell('Before the run: '+this.mission.next(this.state.flags)?.label,3);}
   if(p.x>mission001.challenge.start&&p.x<mission001.challenge.end){this.challengeTime+=dt;
    const hazards=[{x:5170,w:110},{x:5780+Math.sin(this.time*1.4)*35,w:60}];if(this.hitCooldown<=0&&p.y>641&&hazards.some(h=>p.x+20>h.x&&p.x-20<h.x+h.w)){p.stumble=.55;p.velocity*=.2;this.hitCooldown=1.4;this.camera.shake=this.reduced?0:.15;this.collectibles.burst(p.x,p.y-10,'#90c9e2');this.audio.tone(92,.12,.03);this.tell('JUST A STUMBLE. KEEP GOING.',1.3);}
   }
   if(p.x>=mission001.challenge.end&&this.mission.canChallenge(this.state.flags))this.mark('challenge');
   if(this.mission.shouldEnd(p.x,this.state.flags)){this.state.flags.add('complete');p.velocity=0;this.setPhase('ending');this.audio.tone(523,.65,.035);this.save();}
  }
  this.camera.worldWidth=this.state.scene==='stop'?1360:mission001.worldWidth;this.camera.update(dt,p,this.viewWidth,this.reduced);this.camera.zoom+=(1-this.camera.zoom)*Math.min(1,dt*3);
  if(Math.abs(p.velocity)>20&&p.grounded&&this.time-this.lastFoot>.31){this.audio.footstep();this.lastFoot=this.time;}
  this.saveClock+=dt;if(this.saveClock>2){this.saveClock=0;this.save();}
 }
 snapshot(){const near=this.state.phase==='playing'?this.interactions.nearest(this.state,this.player):null;return {phase:this.state.phase,scene:this.state.scene,phaseTime:this.phaseTime,time:this.time,netWorth:this.state.netWorth,bananas:this.collectibles.count(this.state),flags:[...this.state.flags],secrets:this.state.secrets.size,vote:this.state.vote,near,encounter:this.dialogue.encounter,node:this.dialogue.node,nodeId:this.dialogue.nodeId,objective:this.mission.next(this.state.flags),notice:this.noticeTime>0?this.notice:'',achievement:this.achievementTime>0,hasSave:this.hasSave,x:this.player.x,challenge:this.state.scene==='street'&&this.player.x>mission001.challenge.start&&this.player.x<mission001.challenge.end,challengeTime:this.challengeTime,progress:Math.min(100,(this.player.x-mission001.startX)/(mission001.endX-mission001.startX)*100)};}
}
export type GameSnapshot=ReturnType<GameRuntime['snapshot']>;
