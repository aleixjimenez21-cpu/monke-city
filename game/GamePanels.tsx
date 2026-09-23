import {Portrait,BananaIcon} from './ArtUI';
import {useState,useEffect,useRef} from 'react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {socialLinks,voteOptions,bananaTotal} from './content';
import type {GameSnapshot} from './runtime';
export function DiscoveryPanel({view,onNext,onClose,onVote,onHold=()=>{}}:{onHold?:(hold:boolean)=>void;view:GameSnapshot;onNext:(s?:string)=>void;onClose:()=>void;onVote:(s:string)=>Promise<void>}){const e=view.encounter,n=view.node,speaker=n?.speaker;const names={hero:'RICHMONKE',doubter:'THE DOUBTER',owner:'MONKE STOP OWNER',ape:'APEONFONE'};const locked=!!e?.story&&!view.flags.includes(e.flag??'')&&!!(n?.next||n?.choices);if(e?.scene==='stop'&&view.phase==='dialogue')return <StoreInspection view={view} onNext={onNext} onClose={onClose} onVote={onVote} onHold={onHold}/>;return <Dialog open={view.phase==='dialogue'&&!!e} onOpenChange={v=>!v&&onClose()}><DialogContent showCloseButton={!locked} className={`game-menu discovery-panel panel-npc encounter-${e?.id} mood-${n?.mood??'thinking'}`}>
 <Portrait kind={speaker??'hero'} talking={!!speaker}/>
 <DialogTitle>{speaker?names[speaker]:e?.title}</DialogTitle><DialogDescription>{e?.id==='ape'?'Concept cameo · collaboration not confirmed.':e?.kind==='secret'?'TAKE A LOOK · OPTIONAL':e?.story?'MISSION 001 · THE WAY IN':'MONKE CITY'}</DialogDescription>
 <p className="dialogue-line" key={`${e?.id}-${view.nodeId}`}>{n?.text}</p>
 {n?.choices?<div className="dialogue-choices">{n.choices.map(choice=><button key={choice.label} className="primary small" onClick={()=>onNext(choice.label)}>{choice.label}<span>→</span></button>)}</div>:<button className="primary small dialogue-next" onClick={()=>onNext()}>{n?.next?'NEXT':e?.id==='rich'?'CONTINUE JOURNEY':'ON WE GO'} <span>→</span></button>}

 </DialogContent></Dialog>;}
export function SocialButtons({compact=false}:{compact?:boolean}){return <div className={compact?'social-buttons compact':'social-buttons'}>
 <a href={socialLinks.x} target="_blank" rel="noopener noreferrer" aria-label="Open RICHMONKE on X">X</a>
 <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" aria-label="Open RICHMONKE Telegram">Telegram</a>
</div>;}
export function Ending({view,onReplay}:{view:GameSnapshot;onReplay:()=>void}){const[skip,setSkip]=useState(false);const t=skip||view.reduced?20:view.phaseTime,final=t>=6;return <section className="ending episode-ending" aria-label="Mission one ending">
 {t<.8?<div className="ending-beat"><span className="eyebrow">DOWNTOWN ACCESS</span><h2>MONKE CITY</h2></div>:t<2?<div className="ending-beat" key="complete"><span className="eyebrow">MISSION #001</span><h2>COMPLETE!</h2></div>:t<4?<div className="ending-beat" key="seven"><h2>STARTED<br/>WITH <em>$7.</em></h2></div>:t<6?<div className="ending-beat" key="rest"><h2>THE REST<br/><em>ISN'T WRITTEN YET.</em></h2></div>:<div className="episode-finale"><span className="eyebrow">MISSION #001 · COMPLETE</span><h2>THE REST<br/><em>IS UP TO THE MONKES.</em></h2><div className="next-mission">MISSION #002 <b>LOCKED</b><span>THE NEXT CHAPTER IS ON ITS WAY.</span></div><p>THE COMMUNITY DECIDES WHAT'S NEXT.</p><SocialButtons/><div className="episode-receipt"><BananaIcon/> {view.bananas}/{bananaTotal} finds <span>· MISSION COMPLETE</span></div><button className="text-button" onClick={onReplay}>PLAY THE EPISODE AGAIN</button></div>}
 {!final&&<button className="text-button skip-ending" onClick={()=>setSkip(true)}>SKIP TO NEXT CHAPTER →</button>}
 </section>;}
export function GameMenu({open,view,onClose,onRestart}:{open:boolean;view:GameSnapshot;onClose:()=>void;onRestart:()=>void}){const[confirm,setConfirm]=useState(false);return <Dialog open={open} onOpenChange={v=>{if(!v){setConfirm(false);onClose();}}}><DialogContent className="game-menu"><DialogTitle>TAKE A BREATHER.</DialogTitle><DialogDescription>Your journey is saved on this device.</DialogDescription><div className="pause-objective"><span className="eyebrow">UP NEXT</span><h3>{view.objective?.label??'The next chapter.'}</h3><p><BananaIcon/> {view.bananas}/{bananaTotal} finds</p></div><div className="pause-controls"><span>A / D <b>MOVE</b></span><span>SPACE <b>JUMP</b></span><span>E <b>INTERACT</b></span></div><p className="prototype-note">Cash and banana coins are game items, not $RICH prices or real money.</p><button className="primary small" onClick={onClose}>BACK TO IT →</button>{confirm?<div className="restart-confirm"><p>Start from $7 and clear this episode’s progress?</p><button onClick={()=>{setConfirm(false);onRestart();}}>Start from the motel</button><button onClick={()=>setConfirm(false)}>Keep my journey</button></div>:<button className="text-button" onClick={()=>setConfirm(true)}>Start the episode again</button>}</DialogContent></Dialog>;}

function StoreInspection({view,onNext,onClose,onVote,onHold}:{view:GameSnapshot;onNext:(s?:string)=>void;onClose:()=>void;onVote:(s:string)=>Promise<void>;onHold:(hold:boolean)=>void}){
 const next=useRef<HTMLButtonElement>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 useEffect(()=>{next.current?.focus();return()=>onHold(false);},[]);
 const e=view.encounter!,n=view.node,who=n?.speaker==='hero'?'RICHMONKE':n?.speaker==='owner'?'SHOPKEEPER':e.title;
 async function vote(choice:string){setBusy(true);try{await onVote(choice);setError('');}catch{setError('Try again.');}finally{setBusy(false);}}
 return <section className={`store-inspection inspect-${e.id}`} role="region" aria-label={e.title}>
 <div className="inspection-caption"><span>{who}</span><p key={view.nodeId}>{n?.text}</p><button ref={next} onClick={()=>onNext()} aria-label={n?.next?'Next line':'Back to the shop'}>{n?.next?'NEXT →':'BACK →'}</button><button className="inspection-close" onClick={onClose} aria-label="Close inspection">×</button></div>
 {e.kind==='board'&&<details onToggle={event=>onHold(event.currentTarget.open)}><summary>Optional · choose a district</summary><div className="store-vote">{voteOptions.map(choice=><button key={choice} disabled={busy} aria-pressed={view.vote===choice} onClick={()=>void vote(choice)}>{choice}{view.vote===choice?' ✓':''}</button>)}</div><small>Practice vote · saved on this device.</small>{error&&<small role="alert">{error}</small>}</details>}
 </section>;
}
