"use client";
import Image from "next/image";

interface BackdropProps {
  onImageLoad: () => void
}

const Backdrop = ({ onImageLoad }: BackdropProps) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen -z-10">
      <Image
        src="/coconino.jpg"
        fill={true}
        style={{ 
          objectFit: 'cover', 
          objectPosition: '75% center',
          transform: 'scaleX(-1)'
        }}
        className="w-full h-auto"
        alt="Background image of Coconino National Forest, Arizona"
        onLoad={onImageLoad}
        priority
      />
      <div className="backdrop-blur-[4px] bg-stone-950/60 h-full w-full"></div>
    </div>
  )
}

export default Backdrop
