"use client";
import Image from "next/image";

interface BackdropProps {
  onImageLoad: () => void
}

const Backdrop = ({ onImageLoad }: BackdropProps) => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen -z-10">
      <Image
        src="/carbondale.jpg"
        fill={true}
        style={{ objectFit: 'cover' }}
        className="w-full h-auto"
        alt="Background image of Carbondale, Colorado"
        onLoad={onImageLoad}
        priority
      />
      <div className="backdrop-blur-[8px] bg-stone-950/40 h-full w-full"></div>
    </div>
  )
}

export default Backdrop
