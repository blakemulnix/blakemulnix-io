import React, { useState } from "react";
import { Command } from "../utils/Command";
import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import TerminalContent from "./TerminalContent";
import { TextDisplayMode } from "./ExecutingText";

interface CommandSelectionContentProps {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayState>>;
}

const commandSelectionCommands = [
  Command.AboutMe,
  Command.ContactInfo,
  Command.WorkExperience,
];

const CommandSelectionContent: React.FC<CommandSelectionContentProps> = ({
  setDisplayState,
}) => {
  const [executingText, setExecutingText] = useState({
    text: "",
    textDisplayMode: TextDisplayMode.Elipsis,
  });

  const executeActiveCommand = (command: Command) => {
    switch (command) {
      case Command.AboutMe:
        setExecutingText({
          text: "Navigating to About Me...",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        executeAfterDelay(() => {
          setDisplayState(DisplayState.AboutMe);
        }, 1000);
        break;
      case Command.ContactInfo:
        setExecutingText({
          text: "Navigating to Contact Info...",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        executeAfterDelay(() => {
          setDisplayState(DisplayState.ContactInfo);
        }, 1000);
        break;
      case Command.WorkExperience:
        setExecutingText({
          text: "Navigating to Work Experience...",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        executeAfterDelay(() => {
          setDisplayState(DisplayState.WorkExperience);
        }, 1000);
        break;
      default:
        console.log("default");
        break;
    }
  };

  return (
    <>
      <p>
        Hello all! I am a full stack developer, channeling my expertise into the
        realm of cloud native applications. Execute any of the commands below to
        learn more about me.
      </p>
      <TerminalContent
        commands={commandSelectionCommands}
        executeCommand={executeActiveCommand}
        executingText={executingText}
      >
        <p className="md:hidden">
          {"("}Double tap to execute a command{")"}
        </p>
        <p className="hidden md:block">
          {"("}Click a command to execute it OR use arrow keys to select command
          and hit enter{")"}
        </p>
      </TerminalContent>
    </>
  );
};

export default CommandSelectionContent;
