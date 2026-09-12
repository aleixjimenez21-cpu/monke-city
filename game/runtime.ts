import { AudioManager, Camera, GameState, MissionSystem, Player, SceneTransition, type Phase } from './systems';
import { AchievementSystem, ChoiceSystem, CollectibleSystem, CommunityBoard, DialogueSystem, InteriorSystem, InteractionSystem, PlayerController, ProgressStore } from './gameplay';
import { encounters, mission001 } from './content';
export class GameRuntime {
 state=new GameState();player=new Player();camera=new Camera();audio=new AudioManager();transition=new SceneTransition();mission=new MissionSystem();
 controller=new PlayerController();collectibles=new CollectibleSystem();achievements=new AchievementSystem();interactions=new InteractionSystem();dialogue=new DialogueSystem();choices=new ChoiceSystem();interior=new InteriorSystem();board=new CommunityBoard();store=new ProgressStore();
 inspectionHeld=false;locationTitle='';locationSub='';locationTime=0;storyCooldown=0;lastBeat=0;lastDistrict='';phaseTime=0;time=0;notice='';noticeTime=0;achievementTime=0;hasSave=false;travelTarget:'stop'|'street'='stop';travelChanged=false;lastFoot=0;saveClock=0;challengeTime=0;hitCooldown=0;reduced=false;viewWidth=1280;
 init(){this.hasSave=this.store.load(this.state,this.player);}
 setPhase(phase:Phase){this.state.phase=phase;this.phaseTime=0;this.transition.reset();}
 tell(message:string,seconds=3){this.notice=message;this.noticeTime=seconds;}
 save(){if(['loading','ready'].includes(this.state.phase)&&this.state.flags.size===0)return;this.store.save(this.state,this.player,this.interior.streetX);}
 start(resume=false){if(!resume){this.state=new GameState();this.player=new Player();this.camera=new Camera();this.store.clear();this.hasSave=false;}this.state.paused=false;this.camera.descent=0;this.camera.x=Math.max(0,this.player.x-this.viewWidth*.37);this.announce(resume&&this.player.x>1650?'THE OUTSKIRTS':'MONKE MOTEL',resume?'YOUR JOURNEY CONTINUES':'THE OUTSKIRTS · START: $7');this.setPhase(resume&&this.state.flags.has('complete')?'ending':'arriving');}
 announce(title:string,sub:string){this.locationTitle=title;this.locationSub=sub;this.locationTime=3;}
 objective(){if(this.state.scene==='stop')return {id:'leave',label:'Look around · city exit →',x:1090};return this.mission.next(this.state.flags);}
 beginStory(id:string){const e=encounters.find(e=>e.id===id);if(!e)return;this.player.velocity=0;this.dialogue.open(e);this.setPhase('dialogue');}
 reset(){this.state=new GameState();this.player=new Player();this.camera=new Camera();this.dialogue.close();this.collectibles.particles=[];this.hasSave=false;this.store.clear();this.notice='';this.locationTime=0;this.storyCooldown=0;this.lastDistrict='';this.setPhase('ready');}
 jump(){if(this.state.phase==='playing'&&!this.state.paused)this.controller.jump.request(this.player);}
 mark(flag:string){if(this.state.flags.has(flag))return;const before=this.objective()?.id;this.state.flags.add(flag);this.save();if(this.objective()?.id!==before){this.tell('NEW OBJECTIVE! '+(this.objective()?.label??'Episode complete'),2.5);this.audio.tone(523,.22,.025);}}
 interact(){if(this.state.phase!=='playing'||this.state.paused)return;const e=this.interactions.nearest(this.state,this.player);if(!e)return;this.player.velocity=0;this.state.flags.add('interacted');this.audio.tone(440,.12,.025);
  if(e.kind==='door'){this.travelTarget=e.id==='exit'?'street':'stop';this.travelChanged=false;this.setPhase('travel');return;}
  this.dialogue.open(e);this.setPhase('dialogue');
 }
 advance(choice?:string){if(this.state.phase!=='dialogue'||(!choice&&this.dialogue.node?.choices))return;const continued=choice?this.choices.choose(this.dialogue,choice):this.dialogue.advance();this.audio.tone(320,.05,.015);if(continued)this.phaseTime=0;if(!continued)this.closeDialogue();}
 closeDialogue(){const e=this.dialogue.encounter;if(!e)return;const finished=!this.dialogue.node?.next&&!this.dialogue.node?.choices;if(e.story&&!finished&&!this.state.flags.has(e.flag??''))return;if(e.flag&&finished)this.mark(e.flag);if(e.kind==='secret'&&finished){this.state.secrets.add(e.id);this.tell(`SECRET FOUND · ${this.state.secrets.size} / 3`);this.collectibles.burst(this.player.x,this.player.y-100,'#d2b4ff');}this.dialogue.close();this.inspectionHeld=false;this.storyCooldown=1;this.setPhase('playing');this.save();}
 async vote(choice:string){await this.board.vote(choice,this.state);this.save();this.audio.tone(660,.16,.025);}
 update(dt:number,direction:number){if(this.state.paused)return;this.time+=dt;if(!this.inspectionHeld)this.phaseTime+=dt;this.noticeTime=Math.max(0,this.noticeTime-dt);this.achievementTime=Math.max(0,this.achievementTime-dt);this.hitCooldown=Math.max(0,this.hitCooldown-dt);this.collectibles.update(dt);if(this.state.phase!=='dialogue')this.locationTime=Math.max(0,this.locationTime-dt);this.storyCooldown=Math.max(0,this.storyCooldown-dt);
  switch(this.state.phase){
   case'loading':if(this.phaseTime>.65)this.setPhase('ready');break;
   case'arriving':this.camera.descent=this.reduced?0:Math.pow(1-Math.min(1,this.phaseTime/.35),3);if(this.phaseTime>.35){this.camera.descent=0;this.setPhase('playing');}break;
   case'travel':if(this.phaseTime>.28&&!this.travelChanged){this.travelChanged=true;if(this.travelTarget==='stop'){this.interior.enter(this.state,this.player,this.camera);this.state.flags.add('stop-entered');this.state.flags.add('stop');this.announce('MONKE STOP','WARM LIGHTS. BIG PLANS.');}else{this.interior.exit(this.state,this.player,this.camera);this.state.flags.add('left-stop');this.announce('THE WAY UP','NEXT: CROWN TOWER');}this.save();}if(this.phaseTime>.65){this.setPhase('playing');}break;
   case'playing':this.updatePlay(dt,direction);break;
   case'dialogue':{const e=this.dialogue.encounter;if(e?.scene==='stop'){const lower=Math.min(0,(1180-this.viewWidth)/2),upper=Math.max(0,1180-this.viewWidth);const target=this.viewWidth>=1180?lower:Math.max(lower,Math.min(upper,e.x-this.viewWidth*.5));this.camera.x+=(target-this.camera.x)*Math.min(1,dt*5);this.camera.zoom+=((this.reduced?1:1.12)-this.camera.zoom)*Math.min(1,dt*4);if(e.duration&&this.phaseTime>=e.duration&&!this.inspectionHeld)this.advance();break;}const effect=this.dialogue.node?.effect;if(effect==='crown'&&!this.reduced){this.camera.x+=(Math.max(0,this.player.x-this.viewWidth*.25)-this.camera.x)*dt;this.camera.zoom+=(1.04-this.camera.zoom)*dt;}break;}
   case'ending':{if(this.phaseTime<1.4)this.player.x+=dt*35;this.player.facing=1;this.camera.x+=(Math.max(0,Math.min(mission001.worldWidth-this.viewWidth,this.player.x-this.viewWidth*.72))-this.camera.x)*Math.min(1,dt*.7);this.camera.zoom+=(1.065-this.camera.zoom)*dt*.4;break;}
  }
 }
 updatePlay(dt:number,direction:number){this.state.playedSeconds+=dt;const p=this.player;const jumped=this.controller.update(p,this.state.scene,dt,direction);if(jumped){this.state.flags.add('jump-used');this.audio.tone(245,.12,.02);}if(direction)this.state.flags.add('moved');
  if(this.state.scene==='street'&&p.x>670&&p.grounded&&this.state.flags.has('jump-used'))this.mark('jumped');
  const found=this.collectibles.collect(this.state,p);if(found.length){this.audio.tone(found.some(i=>i.kind==='banana')?880:660,.17,.03);this.save();if(this.achievements.check(this.state)){this.achievementTime=4;this.audio.tone(1046,.5,.025);this.save();}}
  if(this.state.scene==='street'){
   if(p.x>mission001.challenge.start&&p.x<mission001.challenge.end){this.challengeTime+=dt;if(this.time-this.lastBeat>.38){this.lastBeat=this.time;this.audio.tone(Math.floor(this.challengeTime*2)%2?110:165,.12,.012);}
    const hazards=[{x:2160,w:80}];if(this.hitCooldown<=0&&p.y>641&&hazards.some(h=>p.x+20>h.x&&p.x-20<h.x+h.w)){p.stumble=.55;p.velocity*=.2;this.hitCooldown=1.4;this.camera.shake=this.reduced?0:.15;this.collectibles.burst(p.x,p.y-10,'#90c9e2');this.audio.tone(92,.12,.03);this.tell('JUST A STUMBLE. KEEP GOING.',1.3);}
   }
   if(p.x>=mission001.challenge.end)this.mark('challenge');
   if(this.mission.shouldEnd(p.x,this.state.flags)){this.state.flags.add('complete');p.velocity=0;this.announce('MONKE CITY','DOWNTOWN ACCESS');this.setPhase('ending');this.audio.tone(523,.65,.035);this.save();}
  }
  if(this.state.scene==='street'&&this.state.phase==='playing'){
   const district=p.x>mission001.challenge.end?'overlook':p.x>1350?'run':p.x>870?'shops':'motel';if(district!==this.lastDistrict){this.lastDistrict=district;if(district==='run')this.announce('THE WAY UP','CROWN TOWER →');if(district==='overlook')this.announce('MONKE CITY','DOWNTOWN ACCESS');}
   if(this.storyCooldown<=0&&p.grounded){const f=this.state.flags;if(p.x>=710&&!f.has('doubter'))this.beginStory('doubter');else if(p.x>=1090&&f.has('doubter')&&!f.has('stop')){this.travelTarget='stop';this.travelChanged=false;this.setPhase('travel');}}
  }
  this.camera.worldWidth=this.state.scene==='stop'?1180:mission001.worldWidth;this.camera.update(dt,p,this.viewWidth,this.reduced);if(this.state.scene==='stop'&&this.viewWidth>1180)this.camera.x=(1180-this.viewWidth)/2;this.camera.zoom+=(1-this.camera.zoom)*Math.min(1,dt*3);
  if(Math.abs(p.velocity)>20&&p.grounded&&this.time-this.lastFoot>.31){this.audio.footstep();this.lastFoot=this.time;}
  this.saveClock+=dt;if(this.saveClock>2){this.saveClock=0;this.save();}
 }
 snapshot(){const near=this.state.phase==='playing'?this.interactions.nearest(this.state,this.player):null;return {reduced:this.reduced,phase:this.state.phase,scene:this.state.scene,phaseTime:this.phaseTime,time:this.time,netWorth:this.state.netWorth,bananas:this.collectibles.count(this.state),flags:[...this.state.flags],secrets:this.state.secrets.size,vote:this.state.vote,near,encounter:this.dialogue.encounter,node:this.dialogue.node,nodeId:this.dialogue.nodeId,objective:this.objective(),locationTitle:this.locationTime>0?this.locationTitle:'',locationSub:this.locationSub,notice:this.noticeTime>0?this.notice:'',achievement:this.achievementTime>0,hasSave:this.hasSave,x:this.player.x,challenge:this.state.scene==='street'&&this.player.x>mission001.challenge.start&&this.player.x<mission001.challenge.end,challengeTime:this.challengeTime};}
}
export type GameSnapshot=ReturnType<GameRuntime['snapshot']>;
