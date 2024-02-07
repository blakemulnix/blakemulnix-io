import React from "react";
import Image from 'next/image';


export default async function Page() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen min-w-screen px-64">
      {/* <div className="min-w-full bg-green-300 min-h-screen">
        asdf
      </div>
      <div className="fixed top-0 left-0 h-screen w-screen -z-10"> */}
       <div className="fixed top-0 left-0 h-screen w-screen -z-10">
      <Image
        src="/zion.png"
        quality={100}
        fill={true}
        style={{ objectFit: "cover" }}
        className="w-full h-auto"
        alt="Background image of Carbondale, Colorado"
      />
      </div>
      <div className="text-white bg-stone-900 px-12 py-8 bg-opacity-50 backdrop-blur-sm rounded-3xl">
        <span className="text-9xl font-bold">
          Coming soon!
        </span>
        <div>
      {/* <div className="backdrop-blur-[8px] bg-stone-950/40 h-full w-full"></div> */}
    </div>
   </div>
    </div>
  );
}
