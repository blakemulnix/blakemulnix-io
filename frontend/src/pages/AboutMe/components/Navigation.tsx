import classNames from "classnames";
import { useState } from "react";

enum NavSelection {
  About = "about",
  Experience = "experience",
  Projects = "projects",
}

const Navigation = () => {
  const [navSelection, setNavSelection] = useState(NavSelection.About);


  return (
    <nav className="nav hidden lg:block" aria-label="In-page jump links">
      <ul className="mt-16 w-max">
        <li>
          <a
            className={classNames("group flex items-center py-3", {
              active: navSelection === NavSelection.About,
            })}
            onClick={() => setNavSelection(NavSelection.About)}
            href="#about"
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-stone-400 transition-all group-hover:w-16 group-hover:bg-stone-100 group-focus-visible:w-16 group-focus-visible:bg-stone-100 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-100 group-focus-visible:text-stone-100">
              About
            </span>
          </a>
        </li>
        <li>
          <a
            className={classNames("group flex items-center py-3", {
              active: navSelection === NavSelection.Experience,
            })}
            onClick={() => setNavSelection(NavSelection.Experience)}
            href="#experience"
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-stone-400 transition-all group-hover:w-16 group-hover:bg-stone-100 group-focus-visible:w-16 group-focus-visible:bg-stone-100 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-100 group-focus-visible:text-stone-100">
              Experience
            </span>
          </a>
        </li>
        <li>
          <a
            className={classNames("group flex items-center py-3", {
              active: navSelection === NavSelection.Projects,
            })}
            onClick={() => setNavSelection(NavSelection.Projects)}
            href="#projects"
          >
            <span className="nav-indicator mr-4 h-px w-8 bg-stone-400 transition-all group-hover:w-16 group-hover:bg-stone-100 group-focus-visible:w-16 group-focus-visible:bg-stone-100 motion-reduce:transition-none"></span>
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-stone-400 group-hover:text-stone-100 group-focus-visible:text-stone-100">
              Projects
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
