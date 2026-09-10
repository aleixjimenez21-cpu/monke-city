import { Camera, ParallaxLayer, Player } from './systems';
type C = CanvasRenderingContext2D;
const ink = '#101427';
export function rect(c:C,x:number,y:number,w:number,h:number,fill:string,line=3) { c.fillStyle=fill;c.fillRect(x,y,w,h);if(line){c.strokeStyle=ink;c.lineWidth=line;c.strokeRect(x,y,w,h);} }
export function path(c:C,points:number[][],fill:string,line=3){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=fill;c.fill();if(line){c.strokeStyle=ink;c.lineWidth=line;c.stroke();}}
export function ellipse(c:C,x:number,y:number,rx:number,ry:number,fill:string){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();}
export function text(c:C,s:string,x:number,y:number,size:number,color:string,align:CanvasTextAlign='left'){c.font=`900 ${size}px Arial, sans-serif`;c.fillStyle=color;c.textAlign=align;c.fillText(s,x,y);}
export function neon(c:C,s:string,x:number,y:number,size:number,color:string){c.save();c.shadowColor=color;c.shadowBlur=14;text(c,s,x,y,size,color);c.restore();}
function windows(c:C,x:number,y:number,w:number,h:number,seed:number,bright=false){for(let i=0;i<w-20;i+=26)for(let j=0;j<h-20;j+=31){const n=Math.sin(i*3+j+seed);rect(c,x+12+i,y+15+j,9,14,n>.1?(bright?'#a6ecc1':'#9a94bb'):'#353351',0);}}
function building(c:C,x:number,w:number,h:number,color:string,seed:number){const m=c.getTransform(),sx=m.a*x+m.e;if(sx+w*m.a<0||sx>c.canvas.width)return;rect(c,x,575-h,w,h,color);rect(c,x-5,568-h,w+10,9,'#383448');windows(c,x,575-h,w,h,seed);}
export function crown(c:C,x:number,y:number,size:number){c.save();c.shadowColor='#8dff4c';c.shadowBlur=22;path(c,[[x,y],[x+size*.24,y+size*.35],[x+size*.5,y-size*.18],[x+size*.76,y+size*.35],[x+size,y],[x+size*.86,y+size*.7],[x+size*.14,y+size*.7]],'#b0ff61',2);c.restore();}
function lamp(c:C,x:number){rect(c,x,395,7,267,'#303446');path(c,[[x-2,398],[x+6,388],[x+43,388],[x+49,402]],'#34344a');c.save();const g=c.createRadialGradient(x+39,410,0,x+39,450,110);g.addColorStop(0,'#ffe9a32b');g.addColorStop(1,'#ffe9a300');c.fillStyle=g;c.fillRect(x-70,394,220,270);c.shadowColor='#ffdd8c';c.shadowBlur=17;rect(c,x+20,399,29,5,'#ffe2a0',0);c.restore();}
function car(c:C,x:number,color:string){ellipse(c,x+75,670,93,12,'#0d152855');path(c,[[x,628],[x+28,621],[x+47,594],[x+105,592],[x+140,620],[x+163,630],[x+160,653],[x,653]],color);path(c,[[x+49,603],[x+72,603],[x+72,622],[x+34,622]],'#535e76');path(c,[[x+81,602],[x+102,602],[x+127,622],[x+81,622]],'#68738e');for(const q of [31,130]){ellipse(c,x+q,653,18,19,ink);ellipse(c,x+q,653,9,10,'#697180');}rect(c,x+3,631,13,9,'#f1b581',1);rect(c,x+147,630,13,7,'#c87763',1);}
function shop(c:C,x:number,w:number,name:string,color:string){rect(c,x,437,w,211,'#333449');rect(c,x-8,424,w+16,45,color);text(c,name,x+w/2,454,22,'#efe7d0','center');rect(c,x+18,492,w-90,106,'#192c3a');rect(c,x+w-60,487,42,155,'#242936');rect(c,x+w-49,500,21,76,'#4f6771');for(let k=0;k<4;k++)rect(c,x+22+k*30,510,14,55,'#678878',0);path(c,[[x-6,472],[x+w+6,472],[x+w+16,493],[x-15,493]],'#77605e');}
export class GameScene {
  layers=[new ParallaxLayer(.04),new ParallaxLayer(.13),new ParallaxLayer(.28),new ParallaxLayer(.52),new ParallaxLayer(1),new ParallaxLayer(1.2)];
  sprite:HTMLImageElement|null=null; decorations:((c:C)=>void)|null=null;
  load(){const im=new Image();im.src='/assets/character/richmonke.png';im.onload=()=>this.sprite=im;}
  draw(c:C,w:number,h:number,camera:Camera,p:Player,time:number,reduced:boolean,phase:string){
    c.clearRect(0,0,w,h);const sky=c.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#10152f');sky.addColorStop(.57,'#4b4268');sky.addColorStop(1,'#987e86');c.fillStyle=sky;c.fillRect(0,0,w,h);
    const descend=camera.descent*330;c.save();c.translate(0,descend);
    for(let i=0;i<80;i++){const x=(i*193.7)% (w+200)-camera.x*.02;ellipse(c,x,28+(i*73)%330,i%4===0?1.5:.8,1,'#e4dfd08a');}
    const moonX=w*.75-camera.x*.015;c.save();c.shadowColor='#dddaca';c.shadowBlur=40;ellipse(c,moonX,147,44,44,'#e4dec3');c.restore();ellipse(c,moonX+12,134,40,39,'#23223e');
    for(let i=0;i<8;i++){const x=((i*355+(reduced?0:time*3))%(w+500))-220-camera.x*.04;ellipse(c,x,230+i%3*35,120,18,'#80718f16');ellipse(c,x+55,222+i%3*35,58,28,'#80718f12');}
    c.save();c.translate(-camera.x*.13,0);for(let i=-2;i<32;i++)building(c,i*103,85,80+(Math.sin(i*9)+1)*100,'#4a4967',i);
    const tx=w*.68+camera.x*.11;rect(c,tx,251,105,328,'#2e3c52');path(c,[[tx-15,263],[tx+52,195],[tx+120,263]],'#3d4d61');rect(c,tx+31,201,43,373,'#344b57');for(let i=0;i<8;i++){rect(c,tx+8+i*12,285,3,268,'#77d39b',0);}crown(c,tx+17,160,72);text(c,'CROWN TOWER',tx+52,602,10,'#c5deb6','center');c.restore();
    c.save();c.translate(-camera.x*.28,0);for(let i=-2;i<24;i++){if(i%6!==2)building(c,i*174+40,110,90+(Math.sin(i*4)+1)*97,'#353953',i+4);}c.restore();
    c.save();c.translate(-camera.x*.52,0);for(let i=0;i<17;i++){if(i%4!==0)building(c,i*260+800,148,80+(i%3)*50,'#303449',i+9);}for(let i=0;i<6;i++){const x=((time*22+i*650)%4400);rect(c,x,599,30,4,'#e2c99c',0);}c.restore();
    const road=c.createLinearGradient(0,620,0,800);road.addColorStop(0,'#363445');road.addColorStop(1,'#181f32');c.fillStyle=road;c.fillRect(0,620,w,180);
    c.save();c.translate(-camera.x,0);
    rect(c,-100,627,7900,49,'#64606a');rect(c,-100,675,7900,12,'#242a3c');rect(c,-100,672,7900,4,'#aba08b',0);for(let i=0;i<76;i++)rect(c,i*110,640,1,30,'#393b4a',0);for(let i=0;i<47;i++)rect(c,i*175,748,70,4,'#99857055',0);
    // The outskirts: a crooked motel, warm occupied rooms and a broken vacancy sign.
    rect(c,20,424,570,207,'#63545e');path(c,[[0,423],[33,405],[578,405],[609,423]],'#373242');rect(c,26,433,558,9,'#997b73');
    for(let i=0;i<5;i++){rect(c,49+i*106,478,65,145,'#2a2a3c');rect(c,57+i*106,488,49,64,i===2?'#ddab69':'#4c5b6a');for(let j=0;j<4;j++)rect(c,58+i*106,490+j*15,47,3,'#20283b88',0);text(c,`0${i+1}`,82+i*106,470,11,'#c7b2a1','center');ellipse(c,103+i*106,559,2,2,'#c5ac71');}
    rect(c,12,610,586,18,'#786970');rect(c,54,337,17,70,'#332e3e');rect(c,425,337,17,70,'#332e3e');c.save();c.translate(37,335);c.rotate(-.035);rect(c,0,0,422,63,'#2b2b3f',5);neon(c,'MONKE MOTEL',18,44,43,'#f6b978');c.restore();rect(c,446,450,121,28,'#282737');if(reduced||Math.sin(time*2)>.0)neon(c,'VACANCY',458,469,17,'#accc7b');
    car(c,685,'#79667c');lamp(c,890);shop(c,1150,300,'MONKE STOP','#64765a');rect(c,1475,556,47,87,'#66636f');rect(c,1470,551,57,10,'#39394b');
    shop(c,1730,245,'NIGHT OWL','#665374');lamp(c,2050);rect(c,2130,468,62,176,'#616b82');rect(c,2138,482,46,95,'#1f3542');neon(c,'SODA',2141,505,15,'#98efb5');for(let j=0;j<3;j++)for(let i=0;i<3;i++)rect(c,2144+i*12,520+j*15,6,10,'#c9b687',0);
    shop(c,2420,370,'THE GOOD LIFE','#69897d');car(c,2850,'#718f8b');lamp(c,3060);
    rect(c,3100,305,9,340,'#242c3c');rect(c,3370,305,9,340,'#242c3c');rect(c,3068,290,355,165,'#282e43',6);text(c,'SOMEWHERE',3091,328,26,'#e9dfc0');text(c,'ABOVE ORDINARY.',3091,360,25,'#e9dfc0');crown(c,3320,382,47);text(c,'CROWN RESIDENCES',3091,420,14,'#a5d891');
    for(let i=0;i<10;i++){rect(c,3470+i*130,590,5,69,'#383848');rect(c,3470+i*130,603,130,3,'#535261',0);rect(c,3470+i*130,621,130,3,'#535261',0);}
    rect(c,3765,468,9,197,'#777c7c');rect(c,3650,452,248,80,'#335e56',5);rect(c,3658,460,232,64,'#335e56',1);text(c,'MONKE CITY',3675,490,25,'#ece6c7');text(c,'3 KM  →',3675,517,22,'#ece6c7');lamp(c,4020);
    this.decorations?.(c); this.drawPlayer(c,p,time,reduced);
    for(let i=0;i<12;i++){const x=200+i*387;path(c,[[x,664],[x+13,660],[x+23,665],[x+9,668]],'#c0a38b55',0);}c.restore();
    c.save();c.translate(-camera.x*1.2,0);for(let i=0;i<7;i++){const x=i*910+950;ellipse(c,x,804,110,31,'#111c2d');for(let j=0;j<8;j++)path(c,[[x+j*18-70,820],[x+j*18-90,762-j%3*11],[x+j*18-65,781],[x+j*18-57,756],[x+j*18-50,820]],'#111c2d',0);}c.restore();c.restore();
    const vignette=c.createRadialGradient(w/2,h*.45,w*.2,w/2,h*.45,w*.8);vignette.addColorStop(0,'#080d1800');vignette.addColorStop(1,'#080d1855');c.fillStyle=vignette;c.fillRect(0,0,w,h);
  }
  drawPlayer(c:C,p:Player,t:number,reduced:boolean){const moving=Math.abs(p.velocity)>5,bob=reduced?0:moving?Math.sin(p.step*2)*2:Math.sin(t*2)*1.3;ellipse(c,p.x,668,Math.max(18,42-(662-p.y)*.1),6,'#11142666');c.save();c.translate(p.x,p.y+bob);c.scale(p.facing,1);if(this.sprite){const sw=104,sh=156;c.save();c.rotate(moving?Math.sin(p.step)*.025:0);c.scale(-1,1);c.drawImage(this.sprite,-sw/2,-sh,sw,sh);c.restore();}else{ellipse(c,0,-54,34,49,'#6c301d');rect(c,-28,-33,56,27,'#ffad10');ellipse(c,-19,-6,14,8,'#71341e');ellipse(c,22,-6,14,8,'#71341e');ellipse(c,0,-109,40,38,'#6c301d');ellipse(c,8,-104,32,27,'#d97b35');rect(c,-24,-121,58,18,'#111919');rect(c,-20,-118,21,12,'#00bd73',0);rect(c,8,-118,21,12,'#00bd73',0);}c.restore();if(moving&&p.grounded&&!reduced){for(let i=0;i<3;i++){const age=(t*3+i*.33)%1;ellipse(c,p.x-p.facing*(20+age*35),667-age*8,3+age*4,2,'#d9c7aa'+Math.round((1-age)*65).toString(16).padStart(2,'0'));}}}
}



