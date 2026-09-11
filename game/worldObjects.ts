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
 for(const [i,x] of [[3,2320],[4,3240],[5,3910]])drawNPC(c,i,x,636,t,.82,false,i===4,g.reduced);
 npc(c,1000,t,false,g.dialogue.encounter?.id==='doubter'?'talk':undefined);npc(c,2830,t,true,g.dialogue.encounter?.id==='ape'?g.dialogue.node?.effect:undefined);
 if(!art.images.buildings)rect(c,1357,486,60,147,'#223b34');
 rect(c,1697,501,64,89,'#d3bd9f',2);text(c,'BROKE',1702,523,13,'#4c4355');text(c,'TODAY.',1702,541,13,'#4c4355');text(c,'↗',1718,573,24,'#897586');
 neon(c,'?',2149,550,22,'#d2b4ff');label(c,'NO REFUNDS. NO EXPLANATIONS.',2160,462,'#b0b2c1');
 rect(c,3380,440,259,173,'#455647',5);rect(c,3369,430,280,28,'#687358');text(c,'MONKE CITY',3391,450,15,'#f3e3ae');text(c,'MISSION BOARD',3391,482,18,'#d8f6be');for(let i=0;i<3;i++){rect(c,3395+i*74,499,62,75,i===0?'#d4d4a7':'#809077',1);text(c,i===0?'001':`00${i+1}`,3404+i*74,521,16,'#253e35');rect(c,3404+i*74,540,42,3,'#536553',0);rect(c,3404+i*74,550,30,3,'#536553',0);}rect(c,3390,615,8,47,'#3c4148');rect(c,3615,615,8,47,'#3c4148');
 text(c,'THE CROWN IS EARNED.',4160,514,15,'#b9a1d6');text(c,'YOU’RE EARLY.',4180,544,12,'#a2b391');
 if(!g.mission.canChallenge(g.state.flags)){rect(c,4430,562,20,100,'#b7a06d');rect(c,4448,570,120,25,'#b7a06d');text(c,'CITY CHECKPOINT',4400,544,13,'#dbd6bd');}else{text(c,'CONSTRUCTION RUN →',4440,520,18,'#efd391');}
 for(let i=0;i<7;i++){const x=4610+i*370;rect(c,x,630,18,32,'#c1895e');path(c,[[x-5,662],[x+9,624],[x+23,662]],'#d99660');rect(c,x+2,645,15,5,'#eed5a7',0);}
 ellipse(c,5225,666,75,9,'#80aeca55');ellipse(c,5225+Math.sin(t*3)*5,665,45,3,'#a4d4d944');label(c,'WATCH YOUR STEP',5225,607,'#cebaa0');
 const hx=5780+Math.sin(t*1.4)*35;rect(c,hx,636,60,21,'#836d89');ellipse(c,hx+12,660,7,7,'#242a3e');ellipse(c,hx+49,660,7,7,'#242a3e');rect(c,hx+8,625,42,11,'#c2ae92');
 for(let i=0;i<5;i++){const x=4670+i*580;facadePainter.facade(c,x,220,280+(i%2)*60,['CROWN WORKS','THE HEIGHTS','AFTER HOURS','GREEN AVENUE','CITY LIGHTS'][i],i>1);}
 label(c,'NO SHORTCUTS TO THE CROWN.',6670,562,'#c4d7b7');for(let i=0;i<6;i++){rect(c,6600+i*170,603,7,59,'#626b78');rect(c,6600+i*170,612,170,4,'#8f9097',0);}rect(c,6990,566,170,21,'#897761');rect(c,7000,588,10,68,'#343f4e');rect(c,7140,588,10,68,'#343f4e');
 drawPickups(c,g);
}
export function drawPickups(c:C,g:GameRuntime){for(const item of pickups){if(item.scene!==g.state.scene||g.state.collected.has(item.id))continue;const y=item.y+(g.reduced?0:Math.sin(g.time*3+item.x)*4);c.save();c.shadowColor=item.kind==='banana'?'#ffd85c':'#b8fb70';c.shadowBlur=12;if(item.kind==='banana')goldCoin(c,item.x,y,18,g.reduced?1:Math.cos(g.time*1.5+item.x));else{c.translate(item.x,y);c.rotate(-.14);rect(c,-15,-9,30,18,'#b8ec86',2);text(c,'$',-5,6,15,'#376b41');}c.restore();}
 for(const p of g.collectibles.particles){c.save();c.globalAlpha=Math.min(1,p.life*1.5);if(p.label)text(c,p.label,p.x,p.y,14,p.color,'center');else sparkle(c,p.x,p.y,4,p.color);c.restore();}
}
export function drawInterior(c:C,w:number,h:number,g:GameRuntime,scene:GameScene){
 const grad=c.createLinearGradient(0,0,0,h);grad.addColorStop(0,'#312537');grad.addColorStop(.6,'#795243');grad.addColorStop(1,'#b8875a');c.fillStyle=grad;c.fillRect(0,0,w,h);c.save();c.translate(-g.camera.x,0);if(!art.images.interior){rect(c,20,250,1320,420,'#9b704e');for(let y=280;y<635;y+=38){for(let x=25;x<1340;x+=84)rect(c,x+(y%76?0:40),y,78,32,'#a97e5833',1);} rect(c,20,250,1320,25,'#696d73');rect(c,20,647,1320,70,'#8e827b');for(let i=0;i<13;i++)path(c,[[i*110,717],[i*110+25,648],[i*110+30,648],[i*110+5,717]],'#615d64',0);
 }else{c.drawImage(art.images.interior,0,0,Math.max(1400,w),800);const shade=c.createLinearGradient(0,205,0,745);shade.addColorStop(0,'#ffcf6805');shade.addColorStop(1,'#22182728');c.fillStyle=shade;c.fillRect(0,0,Math.max(1400,w),800);}
 if(!art.images.interior){neon(c,'MONKE STOP',470,324,42,'#e9ca91');label(c,'OPEN ALL NIGHT. EVEN FOR BIG DREAMS.',640,352,'#bfbbb6');}
 if(!art.images.interior){rect(c,68,386,90,267,'#263a3b');rect(c,76,399,74,148,'#61766d');text(c,'EXIT',84,426,20,'#d2e4bd');rect(c,137,559,7,16,'#c4bda0');}else label(c,'EXIT',110,397,'#dceba8');
 rect(c,247,565,168,87,'#9b7b61');rect(c,248,433,165,121,'#5d6268',5);rect(c,260,445,122,91,'#1f373a');for(let i=0;i<12;i++)rect(c,265,449+i*7,112,1,'#9ad3ad22',0);neon(c,'$RICH',275,493,23,'#b8fb70');text(c,'ON AIR',278,518,10,'#dcdbbe');ellipse(c,397,470,6,6,'#e0c792');ellipse(c,397,503,6,6,'#ada5a0');path(c,[[306,433],[281,404],[309,431],[340,401]],'#4a535a',2);label(c,'01 / THE TRANSMISSION',330,597);
 rect(c,477,404,205,167,'#283e47',5);crown(c,550,420,37);path(c,[[575,455],[519,502],[570,541],[646,499],[575,455]],'#547363',2);ellipse(c,519,502,8,8,'#b8fb70');ellipse(c,646,499,7,7,'#9d9da0');text(c,'MONKE CITY',509,559,17,'#cfdbc2');label(c,'02 / CITY MAP',580,599);
 if(!art.images.interior)for(let j=0;j<2;j++){rect(c,765,407+j*77,240,16,'#927963');for(let i=0;i<8;i++)rect(c,780+i*28,374+j*77,15,32,['#a8c489','#d8b375','#a39cb7'][i%3],1);}
 for(const s of platforms.filter(s=>s.scene==='stop'))rect(c,s.x,s.y,s.width,s.height,s.kind==='box'?'#b18f68':'#917b6c');
 rect(c,1088,455,124,200,'#586877',4);rect(c,1097,465,106,109,'#163a34');text(c,'MONKE',1115,498,16,'#b8fb70');text(c,'NETWORK',1107,524,15,'#b8fb70');rect(c,1107,545,81,3,'#6da587',0);rect(c,1105,585,85,14,'#9ca296');ellipse(c,1150,619,8,8,'#b8fb70');label(c,'03 / THE COMMUNITY',1150,432);
 if(!art.images.interior)for(const x of [200,700,1250]){path(c,[[x-40,287],[x-16,262],[x+16,262],[x+40,287]],'#493934');rect(c,x-29,286,58,5,'#ffe7a4',0);softLight(c,x,422,215,'#ffbf5e36');}drawNPC(c,2,1008,652,g.time,1,false,false,g.reduced);rect(c,948,593,119,62,'#76513c');rect(c,940,583,135,12,'#d8ac77');rect(c,988,560,48,24,'#343e40');rect(c,995,548,35,21,'#274b43');text(c,'7.00',997,563,10,'#b8fb70');
 drawPickups(c,g);scene.drawPlayer(c,g.player,g.time,g.reduced);c.restore();
}
