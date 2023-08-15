import React, { useState } from "react";
import { Command } from "../utils/Command";
import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import TerminalContent from "./TerminalContent";
import { TextDisplayMode } from "./ExecutingText";

interface AboutMeContentProps {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayState>>;
}

const aboutMeCommands = [Command.SeeAboutMePage, Command.GoBack];

const AboutMeContent: React.FC<AboutMeContentProps> = ({ setDisplayState }) => {
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
      case Command.SeeAboutMePage:
        break;
      default:
        break;
    }
  };

  return (
    <>
      <p>
        From exploring the web on AOL in gradeschool to crafting cloud-based
        applications, my tech journey has been fueled by curiosity and passion.
        Through experience spanning from Fortune 500 corporations to tiny SaaS
        startups, I have honed the skills needed to shape our technological
        landscape. Explore my about me page to take a closer look at my journey
        and learn what makes me tick.
      </p>
      <TerminalContent
        commands={aboutMeCommands}
        executeCommand={executeActiveCommand}
        executingText={executingText}
      />
    </>
  );
};

export default AboutMeContent;
