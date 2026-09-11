import {art,goldCoin,softLight,sparkle} from './art';
import {drawNPC} from './CharacterArt';
import { rect, path, ellipse, text, neon, crown, GameScene } from './environment';
import { platforms, pickups, mission001 } from './content';
import type { GameRuntime } from './runtime';
type C=CanvasRenderingContext2D;
const facadePainter=new GameScene();
function label(c:C,s:string,x:number,y:number,color='#d8e6c4'){text(c,s,x,y,11,color,'center');}
function banana(c:C,x:number,y:number){c.save();c.translate(x,y);c.rotate(-.25);c.lineWidth=12;c.strokeStyle='#152031';c.beginPath();c.arc(0,-6,16,.12,2.9);c.stroke();c.lineWidth=8;c.strokeStyle='#ffd05a';c.stroke();rect(c,-17,-3,4,6,'#705235',0);c.restore();}
function npc(c:C,x:number,t:number,phone=false,effect?:string){
 if(art.npcs.length){if(phone){rect(c,x-64,595,137,13,'#78524a');rect(c,x-64,568,137,20,'#78524a');rect(c,x-55,603,7,59,'#242c40');rect(c,x+54,603,7,59,'#242c40');}drawNPC(c,phone?1:0,x,660,t,1,!!effect);label(c,phone?'APEONFONE':'THE DOUBTER',x,480);return;}
 const bob=Math.sin(t*1.8)*1.7;c.save();c.translate(x,phone?637:660);
 if(phone){rect(c,-64,-19,137,15,'#876f67');rect(c,-64,-62,137,28,'#876f67');rect(c,-58,-8,8,32,'#262c3f');rect(c,57,-8,8,32,'#262c3f');}
 ellipse(c,0,0,38,7,'#13192c66');c.translate(0,bob);ellipse(c,-18,-8,12,11,'#66707c');ellipse(c,21,-8,12,11,'#66707c');ellipse(c,0,-44,28,40,phone?'#676777':'#6d7580');ellipse(c,-29,-93,10,13,'#858491');ellipse(c,29,-93,10,13,'#858491');ellipse(c,0,-100,33,32,'#676777');ellipse(c,0,-90,27,22,'#aea096');ellipse(c,-10,-105,3,4,'#17202b');ellipse(c,10,-105,3,4,'#17202b');rect(c,-8,-83,17,3,'#52505c',0);
 if(phone){const raise=effect==='phone'||effect==='crown';ellipse(c,26,-56-(raise?18:0),18,9,'#86818b');rect(c,26,-88-(raise?18:0),23,37,'#101c2d');rect(c,30,-84-(raise?18:0),15,27,'#91cfa7',0);if(effect==='crown'){path(c,[[-18,-57],[-44,-96],[-48,-94],[-31,-44]],'#8d8991');}}else{path(c,[[-26,-65],[-34,-35],[-12,-33],[8,-48]],'#7b7e8d');path(c,[[26,-65],[32,-38],[9,-35],[-10,-47]],'#868492');}
 c.restore();label(c,phone?'APEONFONE':'THE DOUBTER',x,phone?476:492,phone?'#c8b9e6':'#dad1b7');
}
export function drawStreetObjects(c:C,g:GameRuntime){
 const t=g.reduced?0:g.time;for(const s of platforms.filter(s=>s.scene==='street')){rect(c,s.x,s.y,s.width,s.height,s.kind==='box'?'#a78261':s.kind==='ledge'?'#666777':'#a27759');if(s.kind==='barrier'){for(let x=s.x+5;x<s.x+s.width-10;x+=25)path(c,[[x,s.y+4],[x+12,s.y+4],[x+25,s.y+25],[x+13,s.y+25]],'#f5cb75',1);rect(c,s.x+8,s.y-8,8,8,'#ffd878',1);}else if(s.kind==='box'){path(c,[[s.x+4,s.y+4],[s.x+s.width-4,s.y+s.height-4],[s.x+s.width-4,s.y+4],[s.x+4,s.y+s.height-4]],'#b99b75',2);}}
 npc(c,760,t,false,g.dialogue.encounter?.id==='doubter'?'talk':undefined);
 if(!art.images.buildings)rect(c,1080,486,60,147,'#223b34');
 for(const x of [1760,2350,2680]){path(c,[[x-5,662],[x+9,624],[x+23,662]],'#d99660');rect(c,x+2,645,15,5,'#eed5a7',0);}
 ellipse(c,2200,666,55,9,'#80aeca55');ellipse(c,2200+Math.sin(t*3)*5,665,35,3,'#a4d4d944');
 for(let i=0;i<4;i++){rect(c,2990+i*170,603,7,59,'#626b78');rect(c,2990+i*170,612,170,4,'#8f9097',0);}
 rect(c,3220,566,170,21,'#897761');rect(c,3230,588,10,68,'#343f4e');rect(c,3370,588,10,68,'#343f4e');
 drawPickups(c,g);
}
export function drawPickups(c:C,g:GameRuntime){for(const item of pickups){if(item.scene!==g.state.scene||g.state.collected.has(item.id))continue;const y=item.y+(g.reduced?0:Math.sin(g.time*3+item.x)*4);c.save();c.shadowColor=item.kind==='banana'?'#ffd85c':'#b8fb70';c.shadowBlur=12;if(item.kind==='banana')goldCoin(c,item.x,y,18,g.reduced?1:Math.cos(g.time*1.5+item.x));else{c.translate(item.x,y);c.rotate(-.14);rect(c,-15,-9,30,18,'#b8ec86',2);text(c,'$',-5,6,15,'#376b41');}c.restore();}
 for(const p of g.collectibles.particles){c.save();c.globalAlpha=Math.min(1,p.life*1.5);if(p.label)text(c,p.label,p.x,p.y,14,p.color,'center');else sparkle(c,p.x,p.y,4,p.color);c.restore();}
}
export function drawInterior(c:C,w:number,h:number,g:GameRuntime,scene:GameScene){
 const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#312537');grad.addColorStop(.6,'#795243');grad.addColorStop(1,'#b8875a');c.fillStyle=grad;c.fillRect(0,0,w,h);c.save();c.translate(-g.camera.x,0);if(!art.images.interior){rect(c,20,250,1320,420,'#9b704e');for(let y=280;y<635;y+=38){for(let x=25;x<1340;x+=84)rect(c,x+(y%76?0:40),y,78,32,'#a97e5833',1);} rect(c,20,250,1320,25,'#696d73');rect(c,20,647,1320,70,'#8e827b');for(let i=0;i<13;i++)path(c,[[i*110,717],[i*110+25,648],[i*110+30,648],[i*110+5,717]],'#615d64',0);
 }else{c.drawImage(art.images.interior,0,0,Math.max(1400,w),800);const shade=c.createLinearGradient(0,205,0,745);shade.addColorStop(0,'#ffcf6805');shade.addColorStop(1,'#22182728');c.fillStyle=shade;c.fillRect(0,0,Math.max(1400,w),800);}

 // Three readable exhibits, directly along the route. Inspecting is optional.
 for(const [x,title] of [[300,'CITY MAP'],[550,'COMMUNITY'],[820,'$RICH']] as const){rect(c,x-111,360,222,219,'#293a3b',5);rect(c,x-102,370,204,199,'#152d32',1);text(c,title,x,397,21,'#e9dba8','center');}
 text(c,'OUTSKIRTS',300,432,17,'#b8fb70','center');text(c,'↓ DOWNTOWN',300,462,17,'#d7ded0','center');text(c,'↓ CROWN DISTRICT',300,492,16,'#d7ded0','center');crown(c,285,509,30);text(c,'NEW MISSIONS. NEW DISTRICTS.',300,552,10,'#e7ddbd','center');
 text(c,'THE COMMUNITY',550,435,19,'#b8fb70','center');text(c,'SHAPES WHAT’S NEXT.',550,466,16,'#e7ddbd','center');text(c,'MISSIONS · DECISIONS',550,516,13,'#d7ded0','center');text(c,'STORY',550,542,15,'#d7ded0','center');
 text(c,'THE TOKEN OF THE',820,435,16,'#b8fb70','center');text(c,'RICHMONKE UNIVERSE',820,464,16,'#e7ddbd','center');text(c,'THE STORY GROWS.',820,516,14,'#d7ded0','center');text(c,'THE CITY GROWS.',820,542,14,'#d7ded0','center');
 for(const s of platforms.filter(s=>s.scene==='stop'))rect(c,s.x,s.y,s.width,s.height,'#b18f68');
 rect(c,978,405,86,247,'#253d37');rect(c,988,419,66,137,'#6b9582');text(c,'CITY →',1020,445,17,'#e9dba8','center');rect(c,1047,573,7,17,'#e5cf83');label(c,'EXIT →',1020,391,'#dceba8');
 drawPickups(c,g);scene.drawPlayer(c,g.player,g.time,g.reduced);c.restore();
}
