import React from "react";
import ReactTyped from "react-typed";

interface ExecutingTextProps {
  text: string;
  textDisplayMode: TextDisplayMode;
}

export enum TextDisplayMode {
  Elipsis = "Elipsis",
  Plain = "Plain",
}

const ExecutingText: React.FC<ExecutingTextProps> = ({
  text,
  textDisplayMode,
}) => {
  if (!text) return null;

  if (textDisplayMode === TextDisplayMode.Plain) {
    return <p>{text}</p>;
  }

  return (
    <p>
      {text}
      <ReactTyped
        strings={["..."]}
        typeSpeed={100}
        loop
        backSpeed={20}
        cursorChar=""
        showCursor={false}
      />
    </p>
  );
};

export default ExecutingText;
