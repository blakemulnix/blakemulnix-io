import React from "react";
import CommandButton from "./CommandButton";
import { Command } from "../utils/Command";

interface AboutMeContentProps {
  activeCommand: Command;
  setActiveCommand: React.Dispatch<React.SetStateAction<Command>>;
  executeCommand: () => void;
  executeElement: JSX.Element | null;
}

export const aboutMeCommandOrder = [Command.GoBack, Command.SeeAboutMePage];

const AboutMeContent: React.FC<AboutMeContentProps> = ({
  activeCommand,
  setActiveCommand,
  executeCommand,
  executeElement,
}) => {
  return (
    <>
      <p>Hello all! About me...</p>
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
          command={Command.SeeAboutMePage}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={() => {
            setActiveCommand(Command.SeeAboutMePage);
            executeCommand();
          }}
        />
      </div>
      {executeElement}
    </>
  );
};

export default AboutMeContent;
