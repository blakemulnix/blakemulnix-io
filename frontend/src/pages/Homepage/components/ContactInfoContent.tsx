import React from "react";
import CommandButton from "./CommandButton";
import { Command } from "../utils/Command";

interface ContactInfoContentProps {
  activeCommand: Command;
  setActiveCommand: React.Dispatch<React.SetStateAction<Command>>;
  executeCommand: () => void;
  executeElement: JSX.Element | null;
}

export const contactInfoCommandOrder = [
  Command.GoBack,
  Command.MoreContactInfo,
];

const ContactInfoContent: React.FC<ContactInfoContentProps> = ({
  activeCommand,
  setActiveCommand,
  executeCommand,
  executeElement,
}) => {
  return (
    <>
      <p>Hello all! Contact info...</p>
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
          command={Command.MoreContactInfo}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={() => {
            setActiveCommand(Command.MoreContactInfo);
            executeCommand();
          }}
        />
      </div>
      {executeElement}
    </>
  );
};

export default ContactInfoContent;
