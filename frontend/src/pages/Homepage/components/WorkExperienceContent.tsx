import { DisplayState } from "../utils/DisplayState";
import { executeAfterDelay } from "../utils/ExecuteAfterDelay";
import { downloadFile } from "../utils/DownloadFile";
import TerminalContent from "./TerminalContent";
import { Command } from "../utils/Command";
import { useState } from "react";

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
  const [executingText, setExecutingText] = useState("");

  const executeActiveCommand = (command: Command) => {
    switch (command) {
      case Command.GoBack:
        setExecutingText("Going back");
        executeAfterDelay(() => {
          setDisplayState(DisplayState.CommandSelection);
        }, 1000);
        break;
      case Command.DownloadResume:
        setExecutingText("Downloading resume");
        executeAfterDelay(() => {
          downloadFile("files/BlakeMulnixResume.pdf", "BlakeMulnixResume.pdf");
        }, 1000);
        executeAfterDelay(() => {
          setExecutingText("");
        }, 2000);
        break;
      case Command.ViewOnlineResume:
        setExecutingText("Redirecting to online resume");
      case Command.ViewProjects:
        setExecutingText("Redirecting to projects page");
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
