import React, { useState } from "react";
import { Command } from "../utils/Command";
import ExecutingText, { TextDisplayMode } from "./ExecutingText";
import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import TerminalContent from "./TerminalContent";

const email = "blakemulnix@gmail.com";
const phone = "3195405170";

interface ContactInfoContentProps {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayState>>;
}

export const contactInfoCommands = [
  Command.CopyEmail,
  Command.CopyPhone,
  Command.GoBack,
];

const ContactInfoContent: React.FC<ContactInfoContentProps> = ({
  setDisplayState,
}) => {
  const [executingText, setExecutingText] = useState({
    text: "",
    textDisplayMode: TextDisplayMode.Elipsis,
  });

  const executeActiveCommand = (command: Command) => {
    switch (command) {
      case Command.GoBack:
        setExecutingText({
          text: "Going back to main menu",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        executeAfterDelay(() => {
          setDisplayState(DisplayState.CommandSelection);
        }, 1000);
        break;
      case Command.CopyEmail:
        setExecutingText({
          text: "Copying email to clipboard",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        navigator.clipboard.writeText(email);
        executeAfterDelay(() => {
          setExecutingText({
            text: "Copied email to your clipboard: " + email,
            textDisplayMode: TextDisplayMode.Plain,
          });
        }, 1000);
        break;
      case Command.CopyPhone:
        setExecutingText({
          text: "Copying phone number to clipboard",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        navigator.clipboard.writeText(phone);
        executeAfterDelay(() => {
          setExecutingText({
            text: "Copied phone number to your clipboard: " + phone,
            textDisplayMode: TextDisplayMode.Plain,
          });
        }, 1000);
        break;
      default:
        console.log("default");
        break;
    }
  };

  return (
    <>
      <p>Here is my contact info. Feel free to give me a holler!</p>
      <TerminalContent
        commands={contactInfoCommands}
        executeCommand={executeActiveCommand}
        executingText={executingText}
      />
    </>
  );
};

export default ContactInfoContent;
