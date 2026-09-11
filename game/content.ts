export type District = 'street' | 'stop';
export type Platform = { id: string; x: number; y: number; width: number; height: number; scene: District; kind: 'box' | 'barrier' | 'ledge' };
export type Pickup = { id: string; x: number; y: number; scene: District; kind: 'cash' | 'banana'; value: number };
export type Speaker = 'hero' | 'doubter' | 'owner' | 'ape';
export type Node = { speaker?:Speaker; mood?:'skeptical'|'confident'|'thinking'|'smiling'|'surprised'; text: string; next?: string; choices?: { label: string; next: string }[]; effect?: string };
export type Encounter = { id: string; x: number; scene: District; label: string; title: string; kind: 'npc' | 'door' | 'tv' | 'map' | 'terminal' | 'board' | 'secret' | 'sign'; nodes?: Record<string, Node>; flag?: string; story?:boolean; requires?: string[] };
export const mission001 = {
 id:'001',name:'GET INTO MONKE CITY',startX:370,endX:3150,worldWidth:3550,
 challenge:{start:1350,end:3050},nextMission:'002',
 objectives:[
  {id:'jumped',label:'Get into Monke City',x:560},
  {id:'doubter',label:'Meet the local',x:760},
  {id:'stop',label:'Discover Monke Stop',x:1120},
  {id:'challenge',label:'Head for the crown',x:3050},
  {id:'complete',label:'Reach the overlook',x:3150},
 ],
};
export const communityLinks: { community: string | null; story: string | null } = { community: null, story: null };
export const voteOptions = ['Casino District', 'Downtown', 'Harbor'] as const;
export const platforms: Platform[] = [
 {id:'first-fence',x:560,y:598,width:78,height:64,scene:'street',kind:'barrier'},
 {id:'run-1',x:1840,y:604,width:85,height:58,scene:'street',kind:'barrier'},
 {id:'run-2',x:2440,y:584,width:92,height:78,scene:'street',kind:'barrier'},
 {id:'shop-crate',x:640,y:608,width:65,height:54,scene:'stop',kind:'box'},
];
export const pickups: Pickup[] = [
 {id:'trailer-first-dollar',scene:'street',kind:'cash',x:465,y:615,value:1},
 {id:'trailer-shop-cash',scene:'stop',kind:'cash',x:672,y:480,value:2},
 {id:'trailer-jump-coin',scene:'street',kind:'banana',x:1885,y:495,value:1},
 {id:'trailer-last-coin',scene:'street',kind:'banana',x:2760,y:614,value:1},
];
export const bananaTotal=pickups.filter(p=>p.kind==='banana').length;
export const encounters: Encounter[] = [
 {id:'doubter',x:760,scene:'street',kind:'npc',label:'TALK',title:'THE DOUBTER',flag:'doubter',story:true,nodes:{
  start:{speaker:'doubter',mood:'skeptical',text:'Monke City? You started with seven bucks.',choices:[{label:'SEVEN IS A START.',next:'watch'},{label:'GOT A BETTER IDEA?',next:'need'}]},
  watch:{speaker:'hero',mood:'confident',text:'Seven is enough to start.',next:'route'},
  need:{speaker:'hero',mood:'smiling',text:'Staying broke? Terrible idea.',next:'route'},
  route:{speaker:'doubter',mood:'skeptical',text:'Then start walking. Monke Stop is ahead.'},
 }},
 {id:'store',x:1120,scene:'street',kind:'door',label:'ENTER MONKE STOP',title:'MONKE STOP'},
 {id:'exit',x:1020,scene:'stop',kind:'door',label:'TO THE CITY →',title:'EXIT'},
 {id:'map',x:300,scene:'stop',kind:'map',label:'CITY MAP',title:'ONE CITY. NEW MISSIONS.',flag:'map'},
 {id:'terminal',x:550,scene:'stop',kind:'board',label:'COMMUNITY BOARD',title:'COMMUNITY BOARD',flag:'terminal'},
 {id:'rich',x:820,scene:'stop',kind:'terminal',label:'$RICH TERMINAL',title:'$RICH',flag:'rich',nodes:{start:{text:'The token of the RichMonke universe.',next:'story'},story:{text:'The story grows. The city grows.'}}},
];
