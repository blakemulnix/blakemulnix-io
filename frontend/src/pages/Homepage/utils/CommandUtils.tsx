import { aboutMeCommandOrder } from "../components/AboutMeContent";
import { selectCommandOrder } from "../components/CommandSelectionContent";
import { contactInfoCommandOrder } from "../components/ContactInfoContent";
import { workExperienceCommandOrder } from "../components/WorkExperienceContent";
import { Command } from "./Command";
import { DisplayState } from "./DisplayState";

export const getCommandOrder = (displayState: DisplayState) => {
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

export const getNextCommand = (
  displayState: DisplayState,
  current: Command
) => {
  let commandOrder = getCommandOrder(displayState);

  const currentIndex = commandOrder.indexOf(current);
  if (currentIndex === commandOrder.length - 1) {
    return commandOrder[0];
  }
  return commandOrder[currentIndex + 1];
};

export const getPreviousCommand = (
  displayState: DisplayState,
  current: Command
) => {
  let commandOrder = getCommandOrder(displayState);

  const currentIndex = commandOrder.indexOf(current);
  if (currentIndex === 0) {
    return commandOrder[commandOrder.length - 1];
  }
  return commandOrder[currentIndex - 1];
};
