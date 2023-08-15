import React from "react";
import CommandButton from "./CommandButton";
import { Command } from "../utils/Command";

interface CommandSelectionContentProps {
  activeCommand: Command;
  setActiveCommand: React.Dispatch<React.SetStateAction<Command>>;
  executeCommand: () => void;
  executeElement: JSX.Element | null;
}

export const selectCommandOrder = [
  Command.AboutMe,
  Command.ContactInfo,
  Command.WorkExperience,
];

const CommandSelectionContent: React.FC<CommandSelectionContentProps> = ({
  activeCommand,
  setActiveCommand,
  executeCommand,
  executeElement,
}) => {
  return (
    <>
      <p>
        Hello all! I am a full stack developer, channeling my expertise into the
        realm of cloud native applications.
      </p>
      <p>Execute any of the commands below to learn more about me.</p>
      <p>Available commands:</p>
      <div>
        <CommandButton
          command={Command.AboutMe}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={executeCommand}
        />
        <CommandButton
          command={Command.ContactInfo}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={executeCommand}
        />
        <CommandButton
          command={Command.WorkExperience}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={executeCommand}
        />
      </div>
      <p className="md:hidden">
        {"("}Double tap to execute{")"}
      </p>
      <p className="hidden md:block">
        {"("}Use arrow keys to select command and hit enter to execute OR click
        to execute{")"}
      </p>
      {executeElement}
    </>
  );
};

export default CommandSelectionContent;
