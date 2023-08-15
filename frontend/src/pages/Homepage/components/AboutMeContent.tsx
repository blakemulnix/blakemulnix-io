import React, { useState } from "react";
import { Command } from "../utils/Command";
import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import TerminalContent from "./TerminalContent";

interface AboutMeContentProps {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayState>>;
}

const aboutMeCommands = [Command.GoBack, Command.SeeAboutMePage];

const AboutMeContent: React.FC<AboutMeContentProps> = ({ setDisplayState }) => {
  const [executingText, setExecutingText] = useState("");

  const executeActiveCommand = (command: Command) => {
    switch (command) {
      case Command.GoBack:
        setExecutingText("Going back");
        executeAfterDelay(() => {
          setDisplayState(DisplayState.CommandSelection);
        }, 1000);
        break;
      case Command.SeeAboutMePage:
        break;
      default:
        break;
    }
  };

  return (
    <>
      <p>Hello all! About me...</p>
      <TerminalContent
        commands={aboutMeCommands}
        executeCommand={executeActiveCommand}
        executingText={executingText}
      />
    </>
  );
};

export default AboutMeContent;
