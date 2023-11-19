import React from "react";
import HighlightLink from "./HighlightLink";

const Footer = () => {
  return (
    <footer className="max-w-md pb-8 text-sm text-stone-200 sm:pb-0">
      <p>
        Coded in{" "}
        <HighlightLink
          text="Visual Studio Code"
          url="https://code.visualstudio.com/"
        />{" "}
        by myself. Built with{" "}
        <HighlightLink text="React" url="https://react.dev/" /> and{" "}
        <HighlightLink text="Tailwind CSS" url="https://tailwindcss.com/" />.
        Deployed with{" "}
        <HighlightLink text="Terraform" url="https://www.terraform.io/" /> and
        hosted on <HighlightLink text="AWS" url="https://aws.amazon.com/" />.{" "}
        Check out the source code on{" "}
        <HighlightLink
          text="GitHub"
          url="https://github.com/blakemulnix/blakemulnix-io"
        />
        .
      </p>
    </footer>
  );
};

export default Footer;
