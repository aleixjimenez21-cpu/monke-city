import {drawStore} from './StoreScene';
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
 c.fillStyle='#101c2a';c.fillRect(0,0,w,h);c.save();c.translate(-g.camera.x,0);drawStore(c,g);drawPickups(c,g);scene.drawPlayer(c,g.player,g.time,g.reduced);c.restore();
}
