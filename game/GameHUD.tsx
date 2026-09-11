import {BananaIcon,CrownIcon} from './ArtUI';
import type { GameSnapshot } from './runtime';
import { mission001 } from './content';
export function GameHUD({view,onInteract,anchor}:{anchor:number;view:GameSnapshot;onInteract:()=>void}){
 const f=view.flags;const tutorial=!f.includes('moved')?'A / D — MOVE':!f.includes('jump-used')&&view.x>530?'SPACE — JUMP':!f.includes('interacted')&&view.near?'E — INTERACT':null;
 const goal=view.objective;const back=view.scene==='street'&&goal&&view.x>goal.x+130;const exitStore=view.scene==='stop'&&['tv','map','terminal'].every(id=>f.includes(id));return <>
 <header className="hud"><div className="wallet"><span>NET WORTH</span><strong key={view.netWorth} className="cash-update">${view.netWorth}<span className="wallet-dot">●</span></strong><small>FICTIONAL GAME CASH</small></div><div className="mission"><span>MISSION #{mission001.id}</span><b>{mission001.name}</b><div className="objective">{exitStore?'← Return to the street':(back?'← ':'→ ')+(goal?.label??'Mission complete')}</div></div><div className="banana-count" title="Find all five fictional collectibles"><BananaIcon/> {view.bananas}<small> / 5</small></div></header>
 {tutorial&&view.phase==='playing'&&<div className="tutorial" key={tutorial}>{tutorial}<span>{tutorial.includes('JUMP')?'Clear the fence. Keep the dream.':'Your journey. Your pace.'}</span></div>}
 {view.near&&<button className="interact" style={{left:`${anchor}%`,top:'55%',bottom:'auto'}} onClick={onInteract}><kbd>E</kbd><span>{view.near.label}</span> ↗</button>}
 {view.notice&&<div className="mission-toast" role="status">✦ <span>{view.notice}</span></div>}
 {view.achievement&&<div className="achievement" role="status"><span>🍌</span><div><small>EARLY MONKE UNLOCKED</small><strong>FOUND ALL 5.</strong></div></div>}
 {view.challenge&&<div className="challenge-label"><i/> CONSTRUCTION RUN <span>JUMP · DODGE · KEEP GOING</span></div>}
 </>;
}

