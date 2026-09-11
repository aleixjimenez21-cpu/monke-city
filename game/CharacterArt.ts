import { art, frame, softLight, sparkle } from './art';
import type { Player } from './systems';
type C=CanvasRenderingContext2D;
export type Expression='idle'|'interact'|'thinking'|'confident'|'surprised';
export class CharacterArt {
 lastGrounded=true;landTime=-99;airTime=-99;previousT=0;landingOffset=0;expression:Expression='idle';interior=false;
 draw(c:C,p:Player,t:number,reduced:boolean,fallback:HTMLImageElement|null){
  if(!this.lastGrounded&&p.grounded)this.landTime=t;if(this.lastGrounded&&!p.grounded)this.airTime=t;this.lastGrounded=p.grounded;
  const landing=Math.max(0,1-(t-this.landTime)/.24),speed=Math.abs(p.velocity),moving=speed>8,run=speed>130,cycle=Math.sin(p.step*1.25);let index=moving?(run?3:1)+(cycle>0?0:1):0;
  if(!p.grounded)index=5;else if(landing>.2)index=6;else if(this.expression==='interact'||this.expression==='confident')index=7;else if(this.expression==='thinking')index=8;else if(this.expression==='surprised')index=5;
  if(reduced&&p.grounded&&moving)index=1;
  const bob=reduced?0:(moving&&p.grounded?Math.abs(cycle)*(run?3.5:2):Math.sin(t*2)*.9);this.landingOffset=reduced?0:landing*1.4;
  c.save();c.fillStyle='#0b182b66';c.beginPath();c.ellipse(p.x,Math.min(666,p.y+3),Math.max(19,36-(662-p.y)*.07),6,0,0,Math.PI*2);c.fill();
  c.translate(p.x,p.y-bob);c.scale(p.facing,1);if(!reduced){c.rotate(p.grounded&&moving?-.035:0);c.scale(1+landing*.065,1-landing*.045);}
  const warm=this.interior||Math.abs(p.x-1405)<250,neon=p.x>6400||Math.abs(p.x-2160)<150;c.shadowColor=warm?'#f8b96c':neon?'#b8fb70':'#94a5e2';c.shadowBlur=warm||neon?5:2;c.shadowOffsetX=-2;
  const f=art.hero[index];if(f){const height=index===6?146:index===5?151:164;frame(c,f,0,0,height);}else if(fallback){c.scale(-1,1);c.drawImage(fallback,-54,-162,108,162);}c.restore();
  if(!reduced&&landing>0){for(let i=0;i<7;i++){const a=i/7*Math.PI,d=(1-landing)*30;c.fillStyle='#d6c4a4'+Math.round(landing*65).toString(16).padStart(2,'0');c.beginPath();c.ellipse(p.x+Math.cos(a)*(15+d),p.y-2-Math.sin(a)*d*.25,3+(1-landing)*4,2,0,0,Math.PI*2);c.fill();}}
  if(!reduced&&moving&&p.grounded){const age=(t*4)%1;c.fillStyle='#b4bcc43b';c.beginPath();c.ellipse(p.x-p.facing*(22+age*12),p.y+1-age*5,2+age*3,1.5,0,0,Math.PI*2);c.fill();}
 }
}
export function drawNPC(c:C,index:number,x:number,y:number,t:number,scale=1,talking=false,flip=false,reduced=false){const f=art.npcs[index];if(!f)return;c.save();c.fillStyle='#10182d55';c.beginPath();c.ellipse(x,y,31*scale,5*scale,0,0,Math.PI*2);c.fill();c.translate(x,y+(reduced?0:Math.sin(t*1.5+index)*1.1));if(flip)c.scale(-1,1);if(talking&&!reduced)c.rotate(Math.sin(t*3)*.018);c.shadowColor=index===2?'#ffc47755':'#9cadd544';c.shadowBlur=3;frame(c,f,0,0,(index===1?132:157)*scale);c.restore();}
