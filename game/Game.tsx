'use client';
import { useEffect, useRef, useState } from 'react';
import { GameScene } from './environment';
import { GameRuntime, type GameSnapshot } from './runtime';
import { drawInterior, drawStreetObjects } from './worldObjects';
import { GameHUD } from './GameHUD';
import { DiscoveryPanel, Ending, GameMenu } from './GamePanels';
import { registerGameTools } from './webmcp';

export default function Game(){
 const canvas=useRef<HTMLCanvasElement>(null),engine=useRef<GameRuntime|null>(null),keys=useRef(new Set<string>());
 const [view,setView]=useState<GameSnapshot>(()=>new GameRuntime().snapshot()),[muted,setMuted]=useState(true),[menu,setMenu]=useState(false);
 const act=(fn:(g:GameRuntime)=>void)=>{const g=engine.current;if(g){keys.current.clear();fn(g);setView(g.snapshot());}};
 useEffect(()=>{
  const g=new GameRuntime(),scene=new GameScene(),c=canvas.current!,ctx=c.getContext('2d')!;engine.current=g;g.init();scene.load();scene.decorations=context=>drawStreetObjects(context,g);g.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let raf=0,last=0,uiClock=0,visible=!document.hidden;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);c.width=Math.round(innerWidth*dpr);c.height=Math.round(innerHeight*dpr);g.viewWidth=800*innerWidth/innerHeight;};resize();
  const down=(e:KeyboardEvent)=>{
   if(e.key==='Escape'&&g.state.phase==='playing'){keys.current.clear();setMenu(true);return;}
   if(g.state.phase==='dialogue'&&!g.dialogue.node?.choices&&['Enter',' '].includes(e.key)){e.preventDefault();if(!e.repeat){g.advance();setView(g.snapshot());}return;}
   if(g.state.phase!=='playing'||g.state.paused)return;
   if(['a','d','ArrowLeft','ArrowRight'].includes(e.key)||['A','D'].includes(e.key)){e.preventDefault();keys.current.add(e.key.toLowerCase());}
   if(e.code==='Space'){e.preventDefault();if(!e.repeat)g.jump();}
   if(e.key.toLowerCase()==='e'&&!e.repeat){e.preventDefault();keys.current.clear();g.interact();setView(g.snapshot());}
  };
  const up=(e:KeyboardEvent)=>keys.current.delete(e.key.toLowerCase());const blur=()=>{keys.current.clear();g.save();};const visibility=()=>{visible=!document.hidden;last=0;blur();};
  addEventListener('keydown',down);addEventListener('keyup',up);addEventListener('resize',resize);addEventListener('blur',blur);addEventListener('pagehide',blur);document.addEventListener('visibilitychange',visibility);
  const frame=(now:number)=>{const dt=Math.min(.035,last?(now-last)/1000:0);last=now;
   if(visible){const d=Number(keys.current.has('d')||keys.current.has('arrowright'))-Number(keys.current.has('a')||keys.current.has('arrowleft'));g.update(dt,d);if(g.state.phase!=='playing')keys.current.clear();uiClock+=dt;if(uiClock>.08){uiClock=0;setView(g.snapshot());}}
   scene.character.interior=g.state.scene==='stop';scene.character.expression=g.state.phase==='ending'?'confident':g.state.phase==='dialogue'?(g.dialogue.node?.effect==='crown'?'surprised':g.dialogue.encounter?.id==='doubter'?(g.dialogue.node?.choices?'thinking':'confident'):'interact'):'idle';
   const z=g.reduced?1:g.camera.zoom,shake=!g.reduced&&g.camera.shake>0?Math.sin(g.time*100)*2:0;ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,c.width,c.height);ctx.setTransform(c.width/g.viewWidth*z,0,0,c.height/800*z,(1-z)*c.width*.5+shake,(1-z)*c.height*.5+scene.character.landingOffset);
   if(g.state.scene==='stop')drawInterior(ctx,g.viewWidth,800,g,scene);else scene.draw(ctx,g.viewWidth,800,g.camera,g.player,g.time,g.reduced,g.state.phase);
   raf=requestAnimationFrame(frame);
  };raf=requestAnimationFrame(frame);setView(g.snapshot());
  return()=>{g.save();cancelAnimationFrame(raf);g.audio.dispose();removeEventListener('keydown',down);removeEventListener('keyup',up);removeEventListener('resize',resize);removeEventListener('blur',blur);removeEventListener('pagehide',blur);document.removeEventListener('visibilitychange',visibility);engine.current=null;};
 },[]);
 useEffect(()=>{if(engine.current)engine.current.state.paused=menu;keys.current.clear();},[menu]);
 useEffect(()=>registerGameTools(()=>{const g=engine.current;return g?{phase:g.state.phase,mission:g.mission.current.id,scene:g.state.scene,x:Math.round(g.player.x),y:Math.round(g.player.y),grounded:g.player.grounded,objective:g.objective()?.label,near:g.snapshot().near?.id,dialogue:g.dialogue.encounter?.id,line:g.dialogue.node?.text,choices:g.dialogue.node?.choices?.map(c=>c.label),netWorth:g.state.netWorth,bananas:g.collectibles.count(g.state),objectives:[...g.state.flags]}:{phase:'loading'};},()=>{const g=engine.current;if(g?.state.phase!=='ready')throw new Error('Wait for the title screen before starting');g.start(g.hasSave);return{phase:g.state.phase};},async input=>{const g=engine.current;if(!g)throw Error('The city is still loading.');if(input.action==='move'){if(g.state.phase!=='playing')throw Error('Finish the current conversation first.');const key=input.direction==='left'?'a':'d';keys.current.add(key);if(input.jump)g.jump();await new Promise(resolve=>setTimeout(resolve,input.seconds!*1000));keys.current.delete(key);}else if(input.action==='jump')g.jump();else if(input.action==='interact'){keys.current.clear();g.interact();}else{keys.current.clear();g.advance(input.choice);}setView(g.snapshot());return{phase:g.state.phase,x:Math.round(g.player.x),y:Math.round(g.player.y),scene:g.state.scene,netWorth:g.state.netWorth,objective:g.objective()?.label,near:g.snapshot().near?.id,dialogue:g.dialogue.encounter?.id,line:g.dialogue.node?.text,choices:g.dialogue.node?.choices?.map(c=>c.label)};}),[]);
 const move=(direction:string)=>(e:React.PointerEvent<HTMLButtonElement>)=>{e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(direction);};const release=(direction:string)=>()=>keys.current.delete(direction);
 const active=['playing','arriving','dialogue','travel','ending'].includes(view.phase);
 return <main className={`game phase-${view.phase} scene-${view.scene}`}><canvas ref={canvas} aria-label="Monke City. Move with A and D, jump with Space, interact with E. Start with seven dollars, learn about Monke City, discover Monke Stop and reach the overlook."/><div className="film-grain"/>
 <div className="brand">RICHMONKE<span> $RICH</span></div><div className="top-actions"><button onClick={()=>{try{const g=engine.current;if(g)setMuted(g.audio.toggle());}catch{engine.current?.tell('Sound is unavailable in this browser.');}}} aria-label={muted?'Turn sound on':'Mute sound'}>{muted?'◌':'◉'} <span>SOUND {muted?'OFF':'ON'}</span></button><button className="menu-button" aria-label="Open game menu" onClick={()=>setMenu(true)}>☰</button></div>
 {view.phase==='loading'&&<div className="loading"><div className="load-bars">▰ ▰ ▰</div><span>LOADING MONKE CITY...</span></div>}
 {view.phase==='ready'&&<section className="start-screen"><span className="eyebrow">NET WORTH</span><h1 className="opening-worth">$7</h1><div className="opening-location"><span className="eyebrow">LOCATION</span><strong>MONKE MOTEL</strong></div><p><small>MISSION #001</small><b>GET INTO MONKE CITY</b></p><button className="primary" onClick={()=>act(g=>g.start(g.hasSave))}>{view.hasSave?'CONTINUE JOURNEY':'START JOURNEY'} <span>→</span></button>{view.hasSave&&<button className="text-button fresh-start" onClick={()=>setMenu(true)}>Start a fresh journey</button>}<div className="start-note">A RICHMONKE STORY · AIM FOR THE CROWN.</div></section>}
 {active&&view.phase!=='ending'&&<GameHUD anchor={engine.current&&view.near?Math.max(12,Math.min(88,100*(view.near.x-engine.current.camera.x)/engine.current.viewWidth)):50} view={view} onInteract={()=>act(g=>g.interact())}/>}
 <DiscoveryPanel view={view} onNext={choice=>act(g=>g.advance(choice))} onClose={()=>act(g=>g.closeDialogue())} onVote={async choice=>{if(engine.current){await engine.current.vote(choice);setView(engine.current.snapshot());}}}/>
 {view.phase==='ending'&&<Ending view={view} onReplay={()=>act(g=>g.reset())}/>}
 {view.phase==='travel'&&<div className="interior-transition"><span>{view.scene==='stop'?'MONKE STOP':'THE OUTSKIRTS'}</span></div>}
 <footer><div className="district"><i/><span>{view.scene==='stop'?'MONKE STOP / OPEN ALL NIGHT':view.x>3050?'CROWN TOWER OVERLOOK':'MONKE MOTEL / OUTSKIRTS'}</span></div>{view.phase==='playing'?<div className="controls-hint"><kbd>A</kbd><kbd>D</kbd><span>MOVE</span><kbd>SPACE</kbd><span>JUMP</span><kbd>E</kbd><span>INTERACT</span></div>:<span className="build-label">EVERY MONKE STARTS SOMEWHERE.</span>}<span className="chapter-number">01 <span>/ THE OUTSKIRTS</span></span></footer>
 {view.phase==='playing'&&!menu&&<><div className="touch-controls"><button aria-label="Walk left" onPointerDown={move('a')} onPointerUp={release('a')} onPointerCancel={release('a')} onLostPointerCapture={release('a')}>←</button><button aria-label="Walk right" onPointerDown={move('d')} onPointerUp={release('d')} onPointerCancel={release('d')} onLostPointerCapture={release('d')}>→</button></div><button className="touch-jump" aria-label="Jump" onPointerDown={e=>{e.preventDefault();engine.current?.jump();}}>↑<span>JUMP</span></button></>}
 <GameMenu open={menu} view={view} onClose={()=>setMenu(false)} onRestart={()=>{act(g=>g.reset());setMenu(false);}}/></main>;
}

