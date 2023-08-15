import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import { downloadFile } from "../utils/DownloadFile";
import TerminalContent from "./TerminalContent";
import { Command } from "../utils/Command";
import { useState } from "react";
import { TextDisplayMode } from "./ExecutingText";

interface WorkExperienceContentProps {
  setDisplayState: React.Dispatch<React.SetStateAction<DisplayState>>;
}

const workExperienceCommands = [
  Command.DownloadResume,
  Command.ViewOnlineResume,
  Command.ViewProjects,
  Command.GoBack,
];

const WorkExperienceContent: React.FC<WorkExperienceContentProps> = ({
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
      case Command.DownloadResume:
        setExecutingText({
          text: "Downloading resume",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        executeAfterDelay(() => {
          downloadFile("files/BlakeMulnixResume.pdf", "BlakeMulnixResume.pdf");
        }, 1000);
        executeAfterDelay(() => {
          setExecutingText({
            text: "",
            textDisplayMode: TextDisplayMode.Plain,
          });
        }, 2000);
        break;
      case Command.ViewOnlineResume:
        setExecutingText({
          text: "Redirecting to online resume",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        break;
      case Command.ViewProjects:
        setExecutingText({
          text: "Redirecting to projects",
          textDisplayMode: TextDisplayMode.Elipsis,
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <p>
        On my software engineering journey, I've ventured into many technical
        domains. Discover more about my professional journey by selecting an
        option below.
      </p>
      <TerminalContent
        commands={workExperienceCommands}
        executeCommand={executeActiveCommand}
        executingText={executingText}
      />
    </>
  );
};

export default WorkExperienceContent;
