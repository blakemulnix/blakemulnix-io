import React from "react";
import Markdown from "markdown-to-jsx";

const MyParagraph = ({ children, ...props }: any) => <div {...props}>{children}</div>

const options = {
  overrides: {
    h1: {
      component: MyParagraph,
      props: {
        className: "text-2xl",
      },
    },
  },
};

// Main Home component
export default function Home() {
  const markdown = `# Hi, *Pluto*!
 
  This is a paragraph of text.`;

  return (
    <main className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="text-center">
        <Markdown options={options}>{markdown}</Markdown>
      </div>
    </main>
  );
}
