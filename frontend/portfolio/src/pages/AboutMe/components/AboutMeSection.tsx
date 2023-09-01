import HighlightLink from "./HighlightLink";
import SectionTitle from "./SectionTitle";

const AboutMeSection = () => {
  return (
    <section
      id="about"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    >
      <SectionTitle title="About" />
      <div>
        <p className="mb-4">
          Back in 2010, I took my first steps into the world of technology,
          configuring a Minecraft beta server for my friends during our middle
          school days. My early curiosity in technology has bloomed into a deep
          appreciation of its potential to enrich our lives.
        </p>
        <p className="mb-4">
          In my career thus far, I have had the privilege of building software
          for a large
          <HighlightLink
            text=" defense company"
            url="https://www.collinsaerospace.com"
          />
          , a small tech shop in the{" "}
          <HighlightLink
            text="railroad industry"
            url="https://www.herzog.com"
          />
          , an{" "}
          <HighlightLink
            text="insurance corporation"
            url="https://www.principal.com"
          />
          , and a{" "}
          <HighlightLink text="startup" url="https://www.gravity-legal.com" />{" "}
          in the legal tech industry.
        </p>
        <p className="mb-4">
          My current obsession lies in the realm of cloud applications, where I
          am busy honing my skills while engaging in the full-stack development
          of applications and infrastructure.
        </p>
        <p className="mb-4">
          When I am not plugging away in VSCode, you'll find me planning another
          gravel bike adventure, dreaming of living out of an RV, or hanging out
          with friends in Discord.
        </p>
      </div>
    </section>
  );
};

export default AboutMeSection;
