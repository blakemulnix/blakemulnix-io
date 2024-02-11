import React from "react";

interface HighlightLinkProps {
  text: string;
  url: string;
}

const HighlightLink = ({ text, url }: HighlightLinkProps) => {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="text-sky-200 hover:text-sky-100">
      {text}
    </a>
  );
};

export default HighlightLink;
