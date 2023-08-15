import { useEffect, useState } from "react";
import classNames from "classnames";
import ReactTyped from "react-typed";
import TerminalNavBar from "./components/TerminalNavBar";
import Footer from "./components/Footer";
import ContactInfoContent from "./components/ContactInfoContent";
import WorkExperienceContent from "./components/WorkExperienceContent";
import AboutMeContent from "./components/AboutMeContent";
import CommandSelectionContent from "./components/CommandSelectionContent";
import { getNextCommand, getPreviousCommand } from "./utils/CommandUtils";
import { Command } from "./utils/Command";
import { DisplayState } from "./utils/DisplayState";

export function Homepage() {
  const [displayState, setDisplayState] = useState(DisplayState.Empty);
  const [activeCommand, setActiveCommand] = useState(Command.AboutMe);
  const [execute, setExecute] = useState("");

  const handleKeyDown = (e: any) => {
    console.log(e.key);

    if (e.key === "ArrowDown") {
      setActiveCommand((prev) => {
        return getNextCommand(displayState, prev);
      });
      console.log(activeCommand);
    }

    if (e.key === "ArrowUp") {
      setActiveCommand((prev) => {
        return getPreviousCommand(displayState, prev);
      });
    }

    if (e.key === "Enter") {
      executeCommand();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    setTimeout(() => {
      setDisplayState(DisplayState.CommandSelection);
    }, 3500);
  }, []);

  // Move into content components
  const executeElement = execute ? (
    <p>
      {execute}
      <ReactTyped
        strings={["..."]}
        typeSpeed={100}
        loop
        backSpeed={20}
        cursorChar=""
        showCursor={false}
      />
    </p>
  ) : null;

  // Move into content components
  const executeCommand = () => {
    setExecute(`Executing ${activeCommand}`);
    setTimeout(() => {
      if (activeCommand === Command.AboutMe) {
        setDisplayState(DisplayState.AboutMe);
        setActiveCommand(Command.GoBack);
        setExecute("");
      }

      if (activeCommand === Command.ContactInfo) {
        setDisplayState(DisplayState.ContactInfo);
        setActiveCommand(Command.GoBack);
        setExecute("");
      }

      if (activeCommand === Command.WorkExperience) {
        setDisplayState(DisplayState.WorkExperience);
        setActiveCommand(Command.GoBack);
        setExecute("");
      }

      if (activeCommand === Command.GoBack) {
        setDisplayState(DisplayState.CommandSelection);
        setActiveCommand(Command.AboutMe);
        setExecute("");
      }
    }, 1000);
  };

  const terminal = (
    <div className="grow flex flex-col flex-nowrap md:rounded-b-xl overflow-auto p-6 bg-white bg-opacity-[5%]">
      <div className="terminal text-xl md:text-2xl space-y-5">
        <p
          className={classNames({
            "cursor-after": displayState === DisplayState.Empty,
          })}
        >
          @blakemulnix ➜ ${" "}
          <ReactTyped
            strings={["whoami"]}
            typeSpeed={250}
            startDelay={500}
            showCursor={false}
          />
        </p>
        {displayState === DisplayState.CommandSelection && (
          <CommandSelectionContent
            activeCommand={activeCommand}
            setActiveCommand={setActiveCommand}
            executeCommand={executeCommand}
            executeElement={executeElement}
          />
        )}
        {displayState === DisplayState.AboutMe && (
          <AboutMeContent
            activeCommand={activeCommand}
            setActiveCommand={setActiveCommand}
            executeCommand={executeCommand}
            executeElement={executeElement}
          />
        )}
        {displayState === DisplayState.ContactInfo && (
          <ContactInfoContent
            activeCommand={activeCommand}
            setActiveCommand={setActiveCommand}
            executeCommand={executeCommand}
            executeElement={executeElement}
          />
        )}
        {displayState === DisplayState.WorkExperience && (
          <WorkExperienceContent
            activeCommand={activeCommand}
            setActiveCommand={setActiveCommand}
            executeCommand={executeCommand}
            executeElement={executeElement}
          />
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-stone-800 to-stone-950 text-white font-mono">
      <div className="h-screen mx-auto w-full max-w-screen-xl flex flex-col md:py-6">
        <TerminalNavBar />
        {terminal}
        <Footer />
      </div>
    </div>
  );
}

export default Homepage;
