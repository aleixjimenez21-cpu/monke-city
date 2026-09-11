export type District = 'street' | 'stop';
export type Platform = { id: string; x: number; y: number; width: number; height: number; scene: District; kind: 'box' | 'barrier' | 'ledge' };
export type Pickup = { id: string; x: number; y: number; scene: District; kind: 'cash' | 'banana'; value: number };
export type Speaker = 'hero' | 'doubter' | 'owner' | 'ape';
export type Node = { speaker?:Speaker; mood?:'skeptical'|'confident'|'thinking'|'smiling'|'surprised'; text: string; next?: string; choices?: { label: string; next: string }[]; effect?: string };
export type Encounter = { id: string; x: number; scene: District; label: string; title: string; kind: 'npc' | 'door' | 'tv' | 'map' | 'terminal' | 'board' | 'secret' | 'sign'; nodes?: Record<string, Node>; flag?: string; story?:boolean; requires?: string[] };
export const CITY_FARE=12;
export const mission001 = {
 id:'001',name:'FIND A WAY INTO MONKE CITY',startX:370,endX:7090,worldWidth:7600,
 challenge:{start:4510,end:6690},nextMission:'002',
 objectives:[
  {id:'jumped',label:'Find a way into Monke City',x:710},
  {id:'doubter',label:'Talk to the local',x:1000},
  {id:'stop',label:'Check Monke Stop',x:1405},
  {id:'rich',label:'Find the street screen',x:2400},
  {id:'ape',label:'Meet the monke by the bench',x:2830},
  {id:'ticket',label:'Get a city ticket · $12',x:3510},
  {id:'challenge',label:'Follow the road to Downtown',x:6690},
  {id:'complete',label:'Reach the overlook',x:7090},
 ],
};
export const communityLinks: { community: string | null; story: string | null } = { community: null, story: null };
export const voteOptions = ['Casino District', 'Downtown', 'Harbor'] as const;
export const platforms: Platform[] = [
 { id:'first-fence',x:675,y:598,width:78,height:64,scene:'street',kind:'barrier' },
 { id:'alley-crate',x:1780,y:612,width:85,height:50,scene:'street',kind:'box' },
 { id:'alley-ledge',x:1890,y:557,width:200,height:20,scene:'street',kind:'ledge' },
 { id:'run-1',x:4850,y:604,width:85,height:58,scene:'street',kind:'barrier' },
 { id:'run-2',x:5480,y:584,width:92,height:78,scene:'street',kind:'barrier' },
 { id:'run-3',x:6080,y:596,width:90,height:66,scene:'street',kind:'barrier' },
 { id:'shelf-step',x:740,y:608,width:75,height:54,scene:'stop',kind:'box' },
 { id:'store-shelf',x:850,y:545,width:170,height:22,scene:'stop',kind:'ledge' },
];
export const pickups: Pickup[] = [
 ...[{x:805,value:1},{x:1190,value:2},{x:1630,value:2},{x:1965,value:2},{x:2310,value:1},{x:3200,value:2},{x:4180,value:1},{x:4730,value:2},{x:5290,value:2},{x:5850,value:1},{x:6410,value:1}].map((p,i)=>({id:`cash-${i}`,scene:'street' as const,kind:'cash' as const,y:615,...p})),
 {id:'shop-cash',scene:'stop',kind:'cash',x:420,y:615,value:2},
 {id:'banana-1',scene:'street',kind:'banana',x:710,y:510,value:1},
 {id:'banana-2',scene:'stop',kind:'banana',x:935,y:488,value:1},
 {id:'banana-3',scene:'street',kind:'banana',x:2010,y:495,value:1},
 {id:'banana-4',scene:'street',kind:'banana',x:3010,y:614,value:1},
 {id:'banana-5',scene:'street',kind:'banana',x:5525,y:487,value:1},
];
export const encounters: Encounter[] = [
 {id:'doubter',x:1000,scene:'street',kind:'npc',label:'TALK',title:'THE DOUBTER',flag:'doubter',story:true,nodes:{
  start:{speaker:'doubter',mood:'skeptical',text:'Monke City? You started with seven bucks.',choices:[{label:'SEVEN IS A START.',next:'watch'},{label:'GOT A BETTER IDEA?',next:'need'}]},
  watch:{speaker:'hero',mood:'confident',text:'Then seven is enough to start.',next:'route'},
  need:{speaker:'hero',mood:'smiling',text:'I could stay here. Terrible idea.',next:'route'},
  route:{speaker:'doubter',mood:'skeptical',text:'Try Monke Stop. Warm lights. Better directions.'},
 }},
 {id:'store',x:1405,scene:'street',kind:'door',label:'ENTER MONKE STOP',title:'MONKE STOP'},
 {id:'exit',x:110,scene:'stop',kind:'door',label:'BACK TO THE STREET',title:'EXIT'},
 {id:'owner',x:230,scene:'stop',kind:'npc',label:'TALK TO THE OWNER',title:'MONKE STOP OWNER',flag:'stop',story:true,nodes:{
  start:{speaker:'owner',mood:'smiling',text:'Crown Tower? Start with the city tram. Twelve bucks buys a ticket.',next:'missions'},
  missions:{speaker:'owner',mood:'smiling',text:'This is your first mission. New chapters open new streets. The monkes help choose what comes next.',next:'road'},
  road:{speaker:'owner',mood:'smiling',text:'Map, TV, community board—have a look. Or head out. The street screen is just past the shops.'},
 }},
 {id:'tv',x:330,scene:'stop',kind:'tv',label:'WATCH THE BROADCAST',title:'MONKE TV',flag:'tv',nodes:{start:{text:'RICHMONKE. START: $7.',next:'crown'},crown:{text:'DESTINATION: THE CROWN.',effect:'crown'}}},
 {id:'map',x:580,scene:'stop',kind:'map',label:'READ CITY MAP',title:'MONKE CITY',flag:'map'},
 {id:'terminal',x:1150,scene:'stop',kind:'board',label:'READ COMMUNITY BOARD',title:'THE STORY NEEDS MONKES.',flag:'terminal'},
 {id:'poster',x:1730,scene:'street',kind:'secret',label:'PEEK BEHIND THE POSTER',title:'SMALL PRINT',nodes:{start:{text:'“Room with a view.” The view was a vending machine.'}}},
 {id:'vending',x:2160,scene:'street',kind:'secret',label:'PRESS THE ODD BUTTON',title:'OUT OF ORDER',nodes:{start:{text:'It ate a coin in 1998. Still chewing.'}}},
 {id:'rich',x:2400,scene:'street',kind:'terminal',label:'WHAT IS $RICH?',title:'WHAT IS $RICH?',flag:'rich',story:true,nodes:{start:{text:'$RICH. The token of the RichMonke universe.',next:'story'},story:{text:'The story grows. The city grows. The community grows with it.'}}},
 {id:'ape',x:2830,scene:'street',kind:'npc',label:'TALK TO APEONFONE',title:'APEONFONE',flag:'ape',story:true,nodes:{start:{speaker:'ape',mood:'thinking',text:'You’re looking at the city.',next:'top',effect:'phone'},top:{speaker:'hero',mood:'confident',text:'I’m looking at the top.',next:'move'},move:{speaker:'ape',mood:'smiling',text:'Then stop looking. Move.',effect:'crown'}}},
 {id:'board',x:3510,scene:'street',kind:'terminal',label:'CITY TRAM TICKETS · $12',title:'ONE TICKET. ONE WAY UP.',requires:['ape'],nodes:{start:{text:'City tram · $12 game cash. Next stop: Downtown.',choices:[{label:'BUY TICKET · $12',next:'bought'},{label:'LOOK AROUND FIRST',next:'later'}]},bought:{text:'Ticket in your pocket. The tram leaves from the overlook. Take the construction street.',effect:'ticket'},later:{text:'No rush. The crown isn’t going anywhere.'},short:{text:'A little short. Check the alleys and Monke Stop. Every dollar counts.'},owned:{text:'You’re all set. Construction street, then the overlook.'}}},
 {id:'sign',x:3760,scene:'street',kind:'sign',label:'READ THE ROAD SIGN',title:'DOWNTOWN THIS WAY',nodes:{start:{text:'Construction ahead. Apparently even dreams have roadworks.'}}},
 {id:'graffiti',x:4240,scene:'street',kind:'secret',label:'LOOK CLOSER',title:'SOMEONE WAS HERE',nodes:{start:{text:'“The crown is earned.” Underneath: a banana. Tough signature.'}}},
];
