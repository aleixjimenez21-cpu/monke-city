import {BananaIcon} from './ArtUI';
import type {GameSnapshot} from './runtime';
export function GameHUD({view,onInteract,anchor}:{anchor:number;view:GameSnapshot;onInteract:()=>void}){const f=view.flags,tutorial=!f.includes('moved')?'A / D — MOVE':!f.includes('jump-used')&&view.x>530?'SPACE — JUMP':!f.includes('interacted')&&view.near&&!view.near.story?'E — TAKE A LOOK':null;const back=view.objective&&view.x>view.objective.x+130;return <>
 <header className="hud"><div className="wallet"><span>NET WORTH</span><strong key={view.netWorth} className="cash-update">${view.netWorth}</strong></div><div className="mission"><span>MISSION #001</span><b className="objective" key={view.objective?.id}>{back?'← ':''}{view.objective?.label??'Episode complete'}</b></div><div className="banana-count" aria-label={`${view.bananas} of 5 banana coins`}><BananaIcon/>{view.bananas}<small>/5</small></div></header>
 {tutorial&&view.phase==='playing'&&<div className="tutorial" key={tutorial}>{tutorial}</div>}
 {view.near&&<button className="interact" style={{left:`${anchor}%`,top:'55%',bottom:'auto'}} onClick={onInteract}><kbd>E</kbd><span>{view.near.id==='board'&&view.ticket?'TICKET READY':view.near.label}</span></button>}
 {view.notice&&view.phase==='playing'&&<div className="mission-toast" role="status"><span>{view.notice}</span></div>}
 {view.achievement&&<div className="achievement" role="status"><BananaIcon/><div><small>EARLY MONKE!</small><strong>ALL FIVE. NICE.</strong></div></div>}
 {view.locationTitle&&view.phase!=='dialogue'&&<div className="location-reveal" key={view.locationTitle}><h2>{view.locationTitle}</h2><span>{view.locationSub}</span></div>}
 </>;}
