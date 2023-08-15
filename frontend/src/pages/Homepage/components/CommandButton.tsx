import React from "react";
import classNames from "classnames";
import { Command } from "../utils/Command";

interface CommandButtonProps {
  command: Command;
  activeCommand: Command | null;
  setActiveCommand: (command: Command) => void;
  executeCommand: () => void;
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
      onClick={() => {
        setActiveCommand(command);
        executeCommand();
      }}
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
