import Footer from "../Homepage/components/TerminalFooter";

export function AboutMe() {
  return (
    <div className="bg-gradient-to-br from-stone-800 to-stone-950 text-white font-mono">
      <div className="mx-auto w-full max-w-screen-xl flex flex-col xl:py-6">
        <div
          className="bg-gradient-to-r from-stone-700 to-lime-800
        max-w-screen-xl w-full mx-auto xl:rounded-xl px-8 py-4 bg-opacity-75"
        >
          <div className="container mx-auto flex flex-row align-center">
            <p className="text-xl md:text-2xl cursor-pointer self-center">
              blakemulnix.io
            </p>
            <div className="grow flex place-content-end space-x-4 self-center justify-content-end">
              <a href="https://www.github.com/blakemulnix">
                <img
                  src="images/github-icon.png"
                  alt="github"
                  className="w-8 h-8 m:w-12 m:h-12
              transition ease-in-out hover:scale-110"
                />
              </a>
              <a href="https://www.linkedin.com/in/blakemulnix">
                <img
                  src="images/linkedin-icon.png"
                  alt="github"
                  className="w-8 h-8 m:w-12 m:h-12
              transition ease-in-out hover:scale-110"
                />
              </a>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 justify-between py-6 bg-opacity-[5%]">
          <div className="h-72 w-80 bg-gradient-to-bl from-stone-700 to-lime-800 rounded-xl p-3">
            Some content
          </div>
          <div className="h-72 w-80 bg-gradient-to-bl from-stone-700 to-lime-800 rounded-xl p-3">
            Some content
          </div>
          <div className="h-72 w-80 bg-gradient-to-bl from-stone-700 to-lime-800 rounded-xl p-3">
            Some content
          </div>
          <div className="h-72 w-80 bg-gradient-to-bl from-stone-700 to-lime-800 rounded-xl p-3">
            Some content
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default AboutMe;
