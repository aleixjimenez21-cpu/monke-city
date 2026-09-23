import type {GameRuntime} from './runtime';
import {ellipse,path,rect} from './environment';
import {softLight} from './art';
export const phoneX=3240;
export const smooth=(n:number)=>{const v=Math.max(0,Math.min(1,n));return v*v*(3-2*v);};
export function carPosition(t:number){return t<7?2520+610*smooth((t-3)/4):3130+1100*Math.pow(Math.max(0,(t-10)/5),2);}
/** Canvas vehicle, using the same outlines and lighting as the existing street art. */
export function drawFinale(c:CanvasRenderingContext2D,g:GameRuntime){
 if(!g.state.flags.has('complete'))return;
 const answered=g.state.flags.has('phone-answered'),t=g.phaseTime;
 c.save();rect(c,phoneX-5,569,10,91,'#273c44',2);rect(c,phoneX-21,536,42,52,'#101a24',3);rect(c,phoneX-14,542,28,33,answered?'#285346':'#b8fb70',0);
 if(!answered){softLight(c,phoneX,554,70,'#b8fb7044');c.strokeStyle='#b8fb70';c.lineWidth=2;for(let i=0;i<2;i++){c.beginPath();c.arc(phoneX,555,32+i*12+(g.reduced?0:Math.sin(g.time*6)*3),-.7,.7);c.stroke();}}
 if((g.state.phase!=='cinematic'&&g.state.phase!=='ending')||(g.state.phase==='cinematic'&&t<3)){c.restore();return;}
 const x=carPosition(g.state.phase==='ending'?15:t),door=smooth((t-7)/.6)*(1-smooth((t-9.3)/.7));
 c.translate(x,0);ellipse(c,105,673,138,12,'#04080bbb');
 const beam=c.createLinearGradient(225,0,590,0);beam.addColorStop(0,'#dff7ff55');beam.addColorStop(1,'#dff7ff00');path(c,[[223,632],[590,596],[590,693],[223,644]],beam as unknown as string,0);
 const body=c.createLinearGradient(0,584,0,660);body.addColorStop(0,'#465560');body.addColorStop(.4,'#111922');body.addColorStop(1,'#05090f');
 path(c,[[-20,630],[24,618],[61,583],[137,583],[181,616],[235,626],[242,650],[226,661],[-22,661]],body as unknown as string,3);
 path(c,[[65,589],[133,589],[166,615],[42,615]],'#6c9caa',2);path(c,[[75,590],[87,590],[59,614],[46,614]],'#bde3e655',0);
 for(const wx of [26,192]){ellipse(c,wx,654,24,24,'#05080e');ellipse(c,wx,654,15,15,'#606f79');ellipse(c,wx,654,6,6,'#101b22');for(let i=0;i<5;i++){const a=i*Math.PI*.4+(t>10?t*12:0);path(c,[[wx,654],[wx+Math.cos(a)*13,654+Math.sin(a)*13],[wx+Math.cos(a+.3)*13,654+Math.sin(a+.3)*13]],'#becbd0',0);}}
 rect(c,216,628,20,5,'#edffff',0);softLight(c,230,630,35,'#cbf5ff55');rect(c,-19,630,10,5,'#ff5757',0);rect(c,77,625,18,3,'#b4c7ca',0);
 if(door>0){path(c,[[48,618],[137,618],[137-35*door,653-72*door],[48-28*door,653-65*door]],'#24313c',2);path(c,[[52,620],[129,620],[108,638-60*door],[40,638-60*door]],'#446c7b',1);}
 c.restore();
}
