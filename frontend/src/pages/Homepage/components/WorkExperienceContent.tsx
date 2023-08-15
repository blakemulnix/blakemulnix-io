import React from "react";
import CommandButton from "./CommandButton";
import { Command } from "../utils/Command";

interface WorkExperienceContentProps {
  activeCommand: Command;
  setActiveCommand: React.Dispatch<React.SetStateAction<Command>>;
  executeCommand: () => void;
  executeElement: JSX.Element | null;
}

export const workExperienceCommandOrder = [
  Command.GoBack,
  Command.MoreWorkExperience,
];

const WorkExperienceContent: React.FC<WorkExperienceContentProps> = ({
  activeCommand,
  setActiveCommand,
  executeCommand,
  executeElement,
}) => {
  return (
    <>
      <p>Hello all! Work experience...</p>
      <div>
        <CommandButton
          command={Command.GoBack}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={() => {
            setActiveCommand(Command.GoBack);
            executeCommand();
          }}
        />
        <CommandButton
          command={Command.MoreWorkExperience}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={() => {
            setActiveCommand(Command.MoreWorkExperience);
            executeCommand();
          }}
        />
      </div>
      {executeElement}
    </>
  );
};

export default WorkExperienceContent;
