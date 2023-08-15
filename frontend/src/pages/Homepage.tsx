import { useEffect, useState } from "react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import ReactTyped from "react-typed";
import CommandButton from "../components/CommandButton";
import TerminalNavBar from "../components/TerminalNavBar";
import Footer from "../components/Footer";
import { Command } from "../utils/Commands";

enum DisplayState {
  Empty = "Empty",
  CommandSelection = "Command Selection",
  AboutMe = "About me",
  ContactInfo = "Contact info",
  WorkExperience = "Work Experience",
}

const selectCommandOrder = [
  Command.AboutMe,
  Command.ContactInfo,
  Command.WorkExperience,
];

const aboutMeCommandOrder = [Command.GoBack, Command.MoreAboutMe];

const contactInfoCommandOrder = [Command.GoBack, Command.MoreContactInfo];

const workExperienceCommandOrder = [Command.GoBack, Command.MoreWorkExperience];

const getCommandOrder = (displayState: DisplayState) => {
  if (displayState === DisplayState.AboutMe) {
    return aboutMeCommandOrder;
  }

  if (displayState === DisplayState.ContactInfo) {
    return contactInfoCommandOrder;
  }

  if (displayState === DisplayState.WorkExperience) {
    return workExperienceCommandOrder;
  }

  return selectCommandOrder;
};

const getNextCommand = (displayState: DisplayState, current: Command) => {
  let commandOrder = getCommandOrder(displayState);

  const currentIndex = commandOrder.indexOf(current);
  if (currentIndex === commandOrder.length - 1) {
    return commandOrder[0];
  }
  return commandOrder[currentIndex + 1];
};

const getPreviousCommand = (displayState: DisplayState, current: Command) => {
  let commandOrder = getCommandOrder(displayState);

  const currentIndex = commandOrder.indexOf(current);
  if (currentIndex === 0) {
    return commandOrder[commandOrder.length - 1];
  }
  return commandOrder[currentIndex - 1];
};

export function Homepage() {
  const navigate = useNavigate();
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

  const commandSelectionContent = (
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

  const contactInfoContent = (
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

  const workExperienceContent = (
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

  const aboutMeContent = (
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
          command={Command.MoreAboutMe}
          activeCommand={activeCommand}
          setActiveCommand={setActiveCommand}
          executeCommand={() => {
            setActiveCommand(Command.MoreAboutMe);
            executeCommand();
          }}
        />
      </div>

      {executeElement}
    </>
  );

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
        {displayState === DisplayState.CommandSelection &&
          commandSelectionContent}
        {displayState === DisplayState.AboutMe && aboutMeContent}
        {displayState === DisplayState.ContactInfo && contactInfoContent}
        {displayState === DisplayState.WorkExperience && workExperienceContent}
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
