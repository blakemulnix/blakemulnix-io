"use client"

import { useState } from "react";
import Backdrop from "./Backdrop";

export default function LoadingScreenContainer({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [renderLoading, setRenderLoading] = useState(true);

  const handleImageLoad = () => {
    setTimeout(() => {
      setLoading(false);
    }, 10);
  };

  const loadingScreenStyle = `
    fixed top-0 left-0 h-screen w-screen
    z-10 flex items-center justify-center 
    bg-stone-900 "}
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

  return (
    <>
      <style>{fadeOutAnimation}</style>

      {renderLoading && (
        <div className={loadingScreenStyle} onAnimationEnd={() => setRenderLoading(false)} style={!loading ? { animation: "fadeOut 1s ease-in-out forwards" } : {}}>
        </div>
      )}
      <Backdrop onImageLoad={handleImageLoad} />
      {children}
    </>
  );
}
