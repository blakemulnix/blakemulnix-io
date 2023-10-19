import classNames from "classnames";
import { useState } from "react";
import ReactTyped from "react-typed";
import Navigation from "./Navigation";
import SocialLinks from "./SocialLinks";

const Header = () => {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-stone-100">
          Blake Mulnix
        </h1>
        <h2 className="mt-3 text-lg md:text-xl font-medium tracking-tight sm:text-xl text-stone-100">
          Cloud Engineer
        </h2>
        <p className="mt-4 mb-8 max-w-xs md:text-md font-medium leading-normal h-[5em] pr-2">
          <ReactTyped
            strings={[
              "Building powerful and beautiful digital experiences on the cloud",
            ]}
            typeSpeed={30}
            cursorChar="|"
            showCursor={true}
          />
        </p>
        <Navigation />
        <SocialLinks />
      </div>
    </header>
  );
};

export default Header;
