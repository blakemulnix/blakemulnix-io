"use client"

import LoadingScreenContainer from "./components/LoadingScreenContainer";
import React from 'react';

export default function Error() {
  return (
    <LoadingScreenContainer>
      <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 text-stone-100">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4 pt-12 lg:pt-24">Error</h1>
          <a href="/" className="hover:bg-stone-400 font-bold py-2 px-4 rounded text-2xl">
            Take me home!
          </a>
        </div>
      </div>
    </LoadingScreenContainer>
  );
}
