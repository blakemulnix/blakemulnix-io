export enum Command {
  AboutMe = "About me",
  ContactInfo = "Contact info",
  WorkExperience = "Work Experience",
  GoBack = "Go back",
  SeeAboutMePage = "See my about me page",
  MoreContactInfo = "More Contact Info",
  MoreWorkExperience = "More Work Experience",
  DownloadResume = "Download my resume",
  ViewOnlineResume = "View my online resume",
  ViewProjects = "View my projects",
  CopyEmail = "Copy my email address",
  CopyPhone = "Copy my phone number"
}

export const getNextCommand = (commandOrder: Command[], current: Command) => {
  const currentIndex = commandOrder.indexOf(current);
  if (currentIndex === commandOrder.length - 1) {
    return commandOrder[0];
  }
  return commandOrder[currentIndex + 1];
};

export const getPreviousCommand = (
  commandOrder: Command[],
  current: Command
) => {
  const currentIndex = commandOrder.indexOf(current);
  if (currentIndex === 0) {
    return commandOrder[commandOrder.length - 1];
  }
  return commandOrder[currentIndex - 1];
};
