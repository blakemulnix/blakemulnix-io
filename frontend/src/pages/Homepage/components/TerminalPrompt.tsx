import React from "react";
import classNames from "classnames";
import ReactTyped from "react-typed";
import { DisplayState } from "../utils/DisplayState";

interface TerminalPromptProps {
  displayState: DisplayState;
}

const TerminalPrompt: React.FC<TerminalPromptProps> = ({ displayState }) => {
  return (
    <p
      className={classNames({
        "cursor-after": displayState === DisplayState.Empty,
      })}
    >
      @blakemulnix ➜ ${" "}
      <ReactTyped
        strings={["whoami"]}
        typeSpeed={250}
        startDelay={500}
        showCursor={false}
      />
    </p>
  );
};

export default TerminalPrompt;
