import { useEffect, useRef } from "react";
import gsap from 'gsap'

export const usePageTransition = () =>{
  const ref = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(!ref.current) return

    gsap.fromTo(
      ref.current,
      {
        opacity:0,y:16
      },
      {opacity:1,y:0,duration:0.45,ease:'power2.out'}
    )
  },[])

  return ref
}