import React, { ReactElement, useEffect, useState } from "react";
import CommandButton from "./CommandButton";
import ExecutingText from "./ExecutingText";
import { getKeyboardListener } from "../utils/KeyboardListener";
import { Command } from "../utils/Command";

interface TerminalContentProps {
  commands: Command[];
  executeCommand: (command: Command) => void;
  executingText: string;
  children?: ReactElement[];
}

const TerminalContent: React.FC<TerminalContentProps> = ({
  commands,
  executeCommand,
  executingText,
  children,
}) => {
  const [activeCommand, setActiveCommand] = useState(commands[0]);

  const handleKeyDown = getKeyboardListener(
    () => {
      setActiveCommand((prev) => {
        const newIndex = (commands.indexOf(prev) + 1) % commands.length;
        return commands[newIndex];
      });
    },
    () => {
      setActiveCommand((prev) => {
        const newIndex =
          (commands.indexOf(prev) - 1 + commands.length) % commands.length;
        return commands[newIndex];
      });
    },
    () => {
      executeCommand(activeCommand);
    }
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <div>
        {commands.map((command) => (
          <CommandButton
            key={command}
            command={command}
            activeCommand={activeCommand}
            setActiveCommand={setActiveCommand}
            executeCommand={() => executeCommand(command)}
          />
        ))}
      </div>
      {children}
      {executingText && <ExecutingText text={executingText} />}
    </>
  );
};

export default TerminalContent;
