export type District = 'street' | 'stop';
export type Platform = { id: string; x: number; y: number; width: number; height: number; scene: District; kind: 'box' | 'barrier' | 'ledge' };
export type Pickup = { id: string; x: number; y: number; scene: District; kind: 'cash' | 'banana'; value: number };
export type Node = { text: string; next?: string; choices?: { label: string; next: string }[]; effect?: string };
export type Encounter = { id: string; x: number; scene: District; label: string; title: string; kind: 'npc' | 'door' | 'tv' | 'map' | 'terminal' | 'board' | 'secret' | 'sign'; nodes?: Record<string, Node>; flag?: string; requires?: string[] };
export const mission001 = {
 id: '001', name: 'GET INTO MONKE CITY', startX: 370, endX: 7090, worldWidth: 7600,
 challenge: { start: 4510, end: 6540 }, nextMission: '002',
 objectives: [
  { id: 'jumped', label: 'Clear the broken fence', x: 680 },
  { id: 'doubter', label: 'Talk to the Doubter', x: 1000 },
  { id: 'tv', label: 'Find the old TV inside Monke Stop', x: 1405 },
  { id: 'map', label: 'Read the city map', x: 1405 },
  { id: 'terminal', label: 'Use the community terminal', x: 1405 },
  { id: 'ape', label: 'Meet ApeOnFone at the bench', x: 2830 },
  { id: 'board', label: 'Visit the community mission board', x: 3510 },
  { id: 'challenge', label: 'Cross the construction run', x: 6540 },
  { id: 'complete', label: 'Reach the Crown Tower overlook', x: 7090 },
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
 ...[{x:440,value:1},{x:520,value:2},{x:595,value:1},{x:1630,value:2},{x:2310,value:1},{x:3200,value:2},{x:4180,value:1},{x:4730,value:2},{x:5290,value:2},{x:5850,value:1},{x:6410,value:1}].map((p,i)=>({id:`cash-${i}`,scene:'street' as const,kind:'cash' as const,y:615,...p})),
 {id:'banana-1',scene:'street',kind:'banana',x:710,y:510,value:1},
 {id:'banana-2',scene:'stop',kind:'banana',x:935,y:488,value:1},
 {id:'banana-3',scene:'street',kind:'banana',x:2010,y:495,value:1},
 {id:'banana-4',scene:'street',kind:'banana',x:3010,y:614,value:1},
 {id:'banana-5',scene:'street',kind:'banana',x:5525,y:487,value:1},
];
export const encounters: Encounter[] = [
 {id:'doubter',x:1000,scene:'street',kind:'npc',label:'TALK',title:'THE DOUBTER',flag:'doubter',nodes:{
  start:{text:'You’re heading to Monke City with $7?',choices:[{label:'WATCH ME.',next:'watch'},{label:'WHAT DO I NEED?',next:'need'}]},
  watch:{text:'Big talk. I like it. Every monke starts somewhere.',next:'route'},
  need:{text:'A little curiosity. A lot of nerve. Start at Monke Stop.',next:'route'},
  route:{text:'You started with seven. The crown is earned. Find your way in.'},
 }},
 {id:'store',x:1405,scene:'street',kind:'door',label:'ENTER MONKE STOP',title:'MONKE STOP'},
 {id:'exit',x:110,scene:'stop',kind:'door',label:'BACK TO THE STREET',title:'EXIT'},
 {id:'tv',x:330,scene:'stop',kind:'tv',label:'TUNE IN',title:'OLD TV / LOCAL TRANSMISSION',flag:'tv',nodes:{start:{text:'RICHMONKE',next:'one'},one:{text:'ONE MONKE. ONE CITY. ONE JOURNEY.',next:'rich'},rich:{text:'$RICH is a character-driven memecoin universe.',next:'seven'},seven:{text:'It starts with RichMonke, $7, and a city to climb.'}}},
 {id:'map',x:580,scene:'stop',kind:'map',label:'READ CITY MAP',title:'MONKE CITY / DISTRICT MAP',flag:'map'},
 {id:'terminal',x:1150,scene:'stop',kind:'terminal',label:'USE COMMUNITY TERMINAL',title:'COMMUNITY TERMINAL',flag:'terminal',nodes:{start:{text:'MONKE CITY IS SHAPED BY ITS COMMUNITY.',next:'decisions'},decisions:{text:'MISSIONS. DECISIONS. STORY.',next:'chapters'},chapters:{text:'Each mission opens a new chapter. More districts. More characters. More to find.',next:'soon'},soon:{text:'MORE COMING SOON. Find the mission board outside.'}}},
 {id:'poster',x:1730,scene:'street',kind:'secret',label:'PEEK BEHIND THE POSTER',title:'A NOTE IN THE WALL',nodes:{start:{text:'BROKE TODAY.',next:'tomorrow'},tomorrow:{text:'Not the end of the story.'}}},
 {id:'vending',x:2160,scene:'street',kind:'secret',label:'TRY THE STRANGE BUTTON',title:'BANANA SIGNAL',nodes:{start:{text:'YOU’RE EARLY.',next:'early'},early:{text:'The machine gives you a knowing blink. Nothing for sale. Yet.'}}},
 {id:'ape',x:2830,scene:'street',kind:'npc',label:'TALK TO APEONFONE',title:'APEONFONE',flag:'ape',nodes:{start:{text:'Everyone watches the chart.',next:'story'},story:{text:'But the early ones know the story.',next:'crown',effect:'phone'},crown:{text:'The journey is bigger than the chart.',next:'point',effect:'crown'},point:{text:'See the crown? One mission at a time.'}}},
 {id:'board',x:3510,scene:'street',kind:'board',label:'OPEN MISSION BOARD',title:'MONKE CITY MISSION BOARD',flag:'board'},
 {id:'sign',x:3760,scene:'street',kind:'sign',label:'READ SIGN',title:'MONKE CITY · 3 KM →',nodes:{start:{text:'Everybody wants in.',next:'few'},few:{text:'Few make it. Keep going.'}}},
 {id:'graffiti',x:4240,scene:'street',kind:'secret',label:'CHECK THE ALLEY',title:'UNDER THE STREETLIGHT',nodes:{start:{text:'THE CROWN IS EARNED.',next:'small'},small:{text:'A tiny banana is signed underneath.'}}},
];
