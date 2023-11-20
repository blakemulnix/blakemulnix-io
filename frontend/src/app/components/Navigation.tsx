'use client'

import classNames from "classnames";
import { useState } from "react";

enum NavSelection {
  About = "about",
  Experience = "experience",
  Projects = "projects",
}

interface NavigationLinkProps {
  href: string;
  text: string;
  navSelection: NavSelection;
}

const Navigation = () => {
  const [activeNav, setActiveNav] = useState(NavSelection.About);
  
  const NavigationLink = ({
    href,
    text,
    navSelection,
  }: NavigationLinkProps) => {
    return (
      <li>
        <a
          href={href}
          className={classNames("group flex items-center py-3", {
            active: activeNav === navSelection,
          })}
          onClick={() => setActiveNav(navSelection)}
        >
          <span className="nav-indicator mr-4 h-px w-8 bg-stone-300 transition-all group-hover:w-16 group-hover:bg-stone-100 group-focus-visible:w-16 group-focus-visible:bg-stone-100 motion-reduce:transition-none"></span>
          <span className="nav-text text-xs font-bold uppercase tracking-widest text-stone-300 group-hover:text-stone-100 group-focus-visible:text-stone-100">
            {text}
          </span>
        </a>
      </li>
    );
  };

  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-16 w-max">
        <NavigationLink
          href="#about"
          text="About"
          navSelection={NavSelection.About}
        />
        <NavigationLink
          href="#experience"
          text="Experience"
          navSelection={NavSelection.Experience}
        />
      </ul>
    </nav>
  );
};

export default Navigation;
