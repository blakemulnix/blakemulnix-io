import React, { useState } from "react";
import { Command } from "../utils/Command";
import ExecutingText from "./ExecutingText";
import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import TerminalContent from "./TerminalContent";

interface ContactInfoContentProps {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayState>>;
}

export const contactInfoCommands = [Command.GoBack, Command.MoreContactInfo];

const ContactInfoContent: React.FC<ContactInfoContentProps> = ({
  setDisplayState,
}) => {
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
        console.log("see about me page");
        break;
      default:
        console.log("default");
        break;
    }
  };

  return (
    <>
      <p>Hello all! Contact info...</p>
      <TerminalContent
        commands={contactInfoCommands}
        executeCommand={executeActiveCommand}
        executingText={executingText}
      />
      {executingText && <ExecutingText text={executingText} />}
    </>
  );
};

export default ContactInfoContent;
