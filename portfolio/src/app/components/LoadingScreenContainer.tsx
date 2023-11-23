"use client";

import { useState } from "react";
import Backdrop from "./Backdrop";

export default function LoadingScreenContainer({ children }: { children: React.ReactNode }) {
  const [doAnimation, setDoAnimation] = useState(false);
  const [renderLoading, setRenderLoading] = useState(true);

  const handleImageLoad = () => {
    setTimeout(() => {
      setDoAnimation(true);
    }, 1000);
  };

  const loadingScreenStyle = `
    fixed top-0 left-0 h-screen w-screen
    z-30 flex items-center justify-center 
    bg-stone-900
  `;

  const animatedTextStyle = `
    fixed top-0 left-0 h-screen w-screen
    flex justify-center items-center
    z-50 text-4xl font-bold
    text-stone-100
  `;

  const fadeOutAnimation = `
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
  `;

  const fadeInOutAnimation = `
    @keyframes fadeInOut {
      0% {
        opacity: 0;
        transform: scale(0.5);
      }
      50% {
        opacity: 1;
        transform: scale(1.2);
      }
      100% {
        opacity: 0;
        transform: scale(1);
      }
    }
  `;

  return (
    <>
      <style>{fadeOutAnimation}</style>
      <style>{fadeInOutAnimation}</style>

      {renderLoading && (
        <>
          <div
            className={loadingScreenStyle}
            onAnimationEnd={() => setRenderLoading(false)}
            style={doAnimation ? { animation: "fadeOut 1s ease-in-out forwards" } : {}}
          ></div>
          <div className={animatedTextStyle} >
            <div className="pb-[10rem]" style={{ animation: "fadeInOut 2s ease-in-out forwards" }}>
            Howdy!
            </div>
          </div>
        </>
      )}
      <Backdrop onImageLoad={handleImageLoad} />
      {children}
    </>
  );
}
