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
          In 2010, my first steps into the world of technology began with the humble task 
          of configuring a Minecraft server for my middle school friends. 
          Since then, my early curiosity in technology has bloomed into a deep
          appreciation of its potential to enrich our lives.
        </p>
        <p className="mb-4">
          In my career thus far, I have had the privilege of building software
          for a large {" "}
          <HighlightLink
            text="defense company"
            url="https://www.collinsaerospace.com"
          />
          , a small tech shop in the{" "}
          <HighlightLink
            text="railroad industry"
            url="https://www.herzog.com"
          />
          , the {" "}
          <HighlightLink
            text="Department of Energy"
            url="https://www.ameslab.gov/"
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
          In my current position as a consultant at {" "}
           <HighlightLink text="Source Allies" url="https://www.sourceallies.com" />{", "}
          I am applying my expertise in the realm of cloud applications and infrastructure. 
          I have the pleasure of working with an incredible team of experts to help our partners in 
          their delivery of high-quality software solutions.
        </p>
        <p className="mb-4">
          When I am not plugging away in VSCode, you'll find me planning another
          gravel bike adventure, dreaming of living out of an RV, or shooting pool
          with friends.
        </p>
      </div>
    </section>
  );
};

export default AboutMeSection;
