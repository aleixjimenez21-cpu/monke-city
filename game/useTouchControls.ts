import {useEffect,useState} from 'react';

/** Includes landscape phones and tablets, not just narrow portrait viewports. */
export function useTouchControls(){
 const [touch,setTouch]=useState(false);
 useEffect(()=>{
  const query=matchMedia('(any-pointer: coarse), (max-width: 700px)');
  const update=()=>setTouch(query.matches);
  update();query.addEventListener('change',update);
  return()=>query.removeEventListener('change',update);
 },[]);
 return touch;
}
