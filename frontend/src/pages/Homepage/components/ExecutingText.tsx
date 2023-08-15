import React from "react";
import ReactTyped from "react-typed";

interface ExecutingTextProps {
  text: string;
}

const ExecutingText: React.FC<ExecutingTextProps> = ({ text: text }) => {
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
