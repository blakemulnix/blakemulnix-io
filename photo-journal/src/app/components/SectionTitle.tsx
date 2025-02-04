import React from "react";

interface SectionTitleProps {
  title: string;
}

const SectionTitle = ({ title }: SectionTitleProps) => {
  return (
    <div className="z-20 sticky top-0  -mx-6 mb-4 w-screen px-6 py-5 backdrop-blur-sm bg-stone-800/50 md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
      <h2 className="text-sm font-bold uppercase tracking-widest text-stone-100 lg:sr-only">{title}</h2>
    </div>
  );
};

export default SectionTitle;
