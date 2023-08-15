import React from 'react';

const TerminalNavBar: React.FC = () => {
  return (
    <div className="max-w-screen-xl w-full mx-auto md:rounded-t-xl px-8 py-4 bg-white bg-opacity-[10%]">
      <div className="container mx-auto flex flex-row align-center">
        <p className="text-2xl cursor-pointer self-center">blakemulnix.io</p>
        <div className="grow flex place-content-end space-x-4 self-center justify-content-end">
          <a href="https://www.github.com/blakemulnix">
            <img
              src="images/github-icon.png"
              alt="github"
              className="w-12 h-12
              transition ease-in-out hover:scale-110"
            />
          </a>
          <a href="https://www.linkedin.com/in/blakemulnix">
            <img
              src="images/linkedin-icon.png"
              alt="github"
              className="inline-block relative object-cover object-center w-12 h-12 rounded-lg
              transition ease-in-out hover:scale-110"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default TerminalNavBar;
