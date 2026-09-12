import {art,frame,softLight,sparkle} from './art';
import {rect,path,ellipse,text,crown} from './environment';
import type {GameRuntime} from './runtime';
type C=CanvasRenderingContext2D;
const W=1180,H=800;
function ink(c:C,s:string,x:number,y:number,size=10,color='#263d3f'){c.save();c.font=`bold ${size}px "Comic Sans MS", cursive`;c.fillStyle=color;c.textAlign='center';c.fillText(s,x,y);c.restore();}
function paper(c:C,x:number,y:number,w:number,h:number,angle:number,fill='#eddbac'){c.save();c.translate(x,y);c.rotate(angle);c.shadowColor='#101c3088';c.shadowBlur=3;c.shadowOffsetY=2;path(c,[[-w/2,-h/2],[w/2-3,-h/2-1],[w/2,h/2],[-w/2+2,h/2-2]],fill,1);c.shadowBlur=0;ellipse(c,0,-h/2+3,2.6,2.6,'#b94e37');c.restore();}
export function drawStore(c:C,g:GameRuntime){
 const im=art.images.interior,t=g.reduced?0:g.time,e=g.state.phase==='dialogue'?g.dialogue.encounter:null,active=e?.id;
 if(im)c.drawImage(im,0,0,W,H);else{rect(c,0,0,W,H,'#263443',0);rect(c,0,160,W,385,'#876349',0);rect(c,0,545,W,255,'#655044',0);text(c,'MONKE STOP',450,180,45,'#f3c76c');}
 // Small physical annotations on the already illustrated map.
 c.save();c.translate(475,267);c.rotate(-.035);
 ink(c,'CROWN TOWER',45,-58,10);ink(c,'CROWN DISTRICT',37,-36,9);
 ink(c,'DOWNTOWN',-29,-3,10);ink(c,'OUTSKIRTS',-41,32,10);
 paper(c,-23,51,108,22,-.02);ink(c,'MONKE MOTEL',-23,51,10);ink(c,'YOU ARE HERE',-23,60,7,'#6b654c');
 ellipse(c,-63,34,4,4,'#f8c74b');if(active==='map'){c.strokeStyle='#b8ef87';c.lineWidth=3;c.setLineDash([4,5]);c.beginPath();c.moveTo(-63,34);c.bezierCurveTo(18,32,-58,-20,13,-31);c.lineTo(45,-49);c.stroke();}c.restore();
 // Cork, pins and individual mission papers, not a menu placed on the wall.
 ink(c,'MONKE CITY BOARD',695,199,12,'#ead29a');
 paper(c,648,246,52,46,-.07);ink(c,'MISSION',648,237,8);ink(c,'#001',648,250,12);ink(c,'✓',648,264,14,'#416239');
 paper(c,727,245,60,53,.04);ink(c,'MISSION',727,230,8);ink(c,'#002',727,243,12);rect(c,722,249,11,9,'#526064',1);c.strokeStyle='#526064';c.lineWidth=2;c.beginPath();c.arc(727.5,249,4,Math.PI,0);c.stroke();ink(c,'LOCKED',727,268,7);
 paper(c,720,301,63,36,.07);ink(c,'NEXT DISTRICT',720,295,7);ink(c,'???',720,311,15);
 ink(c,'THE COMMUNITY',665,321,8,'#efe0b0');ink(c,'SHAPES WHAT’S NEXT.',665,332,8,'#efe0b0');
 if(active==='terminal'){softLight(c,693,266,110,'#ffc97433');for(const [x,y] of [[648,246],[727,243],[720,301]])sparkle(c,x+22,y-18,4,'#d5f5a5');}
 // A working CRT, including a short broadcast when watched.
 c.save();c.beginPath();c.roundRect(520,352,80,61,9);c.clip();rect(c,520,352,80,61,'#14242d',0);
 const beat=active==='tv'?Math.min(4,Math.floor(g.phaseTime/0.8)):-1;
 if(beat===4||(beat<0&&Math.floor(t/5)%2===1)){if(art.images.skyline)c.drawImage(art.images.skyline,1350,0,600,650,520,352,80,61);else crown(c,542,364,35);}
 else if(beat>=0){text(c,['$7.','ONE MONKE.','ONE CITY.','ONE JOURNEY.'][beat],560,385,beat===0?24:9,'#c9efba','center');}
 else{if(art.hero.length)frame(c,art.hero[g.reduced?0:1+(Math.floor(t*2)%2)],558,413,58);text(c,'$7',589,365,9,'#b8fb70','center');}
 if(!g.reduced){for(let i=0;i<16;i++)rect(c,520,352+i*4+(t*8%4),80,1,'#ccebc91c',0);if(active==='tv'&&g.phaseTime<.18)rect(c,520,352,80,61,'#d7e8d477',0);}c.restore();softLight(c,560,390,72,'#83cda312');
 // Shopkeeper is behind the counter: clip the lower body under the existing counter edge.
 const keeper=art.images.keeper;if(keeper){c.save();c.beginPath();c.rect(790,220,180,164);c.clip();const bob=g.reduced?0:Math.sin(t*1.7)*1.1;c.translate(865,485+bob);c.rotate(g.reduced?0:Math.sin(t*.75)*.009);c.drawImage(keeper,-60,-222,120,222);c.restore();if(!g.reduced){sparkle(c,825+Math.sin(t*1.3)*2,359,1.5+Math.max(0,Math.sin(t*1.3))*1.5,'#ffe9bb88');}}
 // Checkout display stays attached to the register, modest in scale.
 rect(c,940,340,5,35,'#182d31',1);rect(c,912,302,72,39,'#172b30',3);rect(c,918,308,60,25,'#224c42',1);text(c,'$RICH',948,326,14,'#b8fb70','center');softLight(c,948,326,45,'#8ceaa91b');
 if(active==='rich'){c.strokeStyle='#c7ef9c';c.lineWidth=1;c.strokeRect(917,307,62,27);}
 // Existing jump reward rests above a small delivery box, with cartoon material details.
 rect(c,640,608,65,54,'#a47749',2);path(c,[[640,608],[655,601],[719,601],[705,608]],'#c99961',2);path(c,[[705,608],[719,601],[719,652],[705,662]],'#725334',2);rect(c,668,610,10,49,'#d2b787',0);ink(c,'MONKE',657,628,7);ink(c,'SUPPLY',657,638,6);path(c,[[646,646],[652,644],[654,649],[649,650]],'#edc554',1);
 // Environmental motion has small amplitudes and respects reduced-motion preferences.
 if(!g.reduced){softLight(c,224,361,94,Math.sin(t*.9)>-.98?'#89e4e70c':'#89e4e725');
 for(let i=0;i<3;i++){const age=(t*.24+i/3)%1;c.save();c.globalAlpha=(1-age)*.17;c.strokeStyle='#ffe5c5';c.lineWidth=2;c.beginPath();c.moveTo(841+i*5,355-age*43);c.bezierCurveTo(834+i*5,341-age*43,850+i*5,333-age*43,845+i*5,320-age*43);c.stroke();c.restore();}
 for(const x of [254,960])softLight(c,x+Math.sin(t*.55)*2,142,88,'#ffbb5116');
 for(let i=0;i<9;i++){const age=(t*.055+i/9)%1;sparkle(c,200+i*92+Math.sin(t*.5+i)*3,480-age*310,1,'#ffdda233');}
 c.save();c.translate(395,414);c.rotate(Math.sin(t*.8)*.025);path(c,[[0,0],[-12,-28],[-5,-27],[1,-8],[10,-24],[16,-25],[6,-2]],'#42633f',1);c.restore();}
 const near=g.state.phase==='playing'?g.interactions.nearest(g.state,g.player):null;
 if(near&&near.kind!=='door'){const y=near.focusY??350;softLight(c,near.x,y,near.id==='rich'?45:70,'#c6ed9c16');c.save();c.globalAlpha=.6;ellipse(c,near.x,y-53,2.5,2.5,'#e9f4bf');c.restore();}
 // A restrained foreground edge anchors the scene without covering the player.
 const shade=c.createLinearGradient(0,718,0,800);shade.addColorStop(0,'#101f3200');shade.addColorStop(1,'#101f3277');c.fillStyle=shade;c.fillRect(0,718,W,82);
}
