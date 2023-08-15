import React, { useState } from "react";
import classNames from "classnames";
import { Command } from "../utils/Commands";

interface CommandButtonProps {
  command: Command; // The command associated with the button
  activeCommand: Command | null; // Currently active command
  setActiveCommand: (command: Command) => void; // Function to set the active command
  executeCommand: () => void; // Function to execute the command
}

const CommandButton: React.FC<CommandButtonProps> = ({
  command,
  activeCommand,
  setActiveCommand,
  executeCommand,
}) => {
  return (
    <div
      className={classNames("flex", "command", "select-none", {
        active: activeCommand === command,
      })}
      onMouseOver={() => setActiveCommand(command)}
      onTouchStart={() => setActiveCommand(command)}
      onDoubleClick={() => {
        setActiveCommand(command);
        executeCommand();
      }}
    >
      <div className="md:basis-1/4">{command}</div>
    </div>
  );
};

export default CommandButton;
