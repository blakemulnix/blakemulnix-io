import { useEffect, useState } from "react";
import { DisplayState } from "../utils/DisplayState";
import TerminalPrompt from "./TerminalPrompt";
import CommandSelectionContent from "./CommandSelectionContent";
import AboutMeContent from "./AboutMeContent";
import ContactInfoContent from "./ContactInfoContent";
import WorkExperienceContent from "./WorkExperienceContent";

const TerminalScreen: React.FC = () => {
  const [displayState, setDisplayState] = useState(DisplayState.Empty);

  useEffect(() => {
    setTimeout(() => {
      setDisplayState(DisplayState.CommandSelection);
    }, 3500);
  }, []);

  return (
    <div className="grow flex flex-col flex-nowrap md:rounded-b-xl overflow-auto p-6 bg-stone-950 bg-opacity-[70%]">
      <div className="terminal-color text-xl md:text-2xl space-y-5">
        <TerminalPrompt displayState={displayState} />
        {displayState === DisplayState.CommandSelection && (
          <CommandSelectionContent setDisplayState={setDisplayState} />
        )}
        {displayState === DisplayState.AboutMe && (
          <AboutMeContent setDisplayState={setDisplayState} />
        )}
        {displayState === DisplayState.ContactInfo && (
          <ContactInfoContent setDisplayState={setDisplayState} />
        )}
        {displayState === DisplayState.WorkExperience && (
          <WorkExperienceContent setDisplayState={setDisplayState} />
        )}
      </div>
    </div>
  );
};

export default TerminalScreen;
