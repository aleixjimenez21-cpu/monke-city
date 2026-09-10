type ModelContext={registerTool:(tool:{name:string;description:string;inputSchema:object;annotations:{readOnlyHint:boolean};execute:(input:unknown)=>unknown},options:{signal:AbortSignal})=>void|Promise<void>};
export function registerGameTools(read:()=>object,start:()=>object){
 const context=(document as Document & {modelContext?:ModelContext}).modelContext;if(!context?.registerTool)return()=>{};const controller=new AbortController();
 for(const tool of [{name:'read_monke_journey',description:'Read the current game phase, mission, position, net worth and road-sign status.',annotations:{readOnlyHint:true},action:read},{name:'start_monke_journey',description:'Start the cinematic arrival from the ready title screen. Does not complete the mission.',annotations:{readOnlyHint:false},action:start}]){
  try{void Promise.resolve(context.registerTool({name:tool.name,description:tool.description,inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:tool.annotations,execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Expected an empty object');return tool.action();}},{signal:controller.signal})).catch(()=>{});}catch{/* Optional browser capability. */}
 }return()=>controller.abort();
}
