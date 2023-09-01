import TerminalNavBar from "./components/TerminalNavBar";
import TerminalScreen from "./components/TerminalScreen";
import Footer from "./components/TerminalFooter";
import "./HomePage.css";

export function Homepage() {
  return (
    <div className=" text-stone-100 font-mono">
      <div className="full-screen-height mx-auto w-full max-w-screen-xl flex flex-col xl:py-6">
        <TerminalNavBar />
        <TerminalScreen />
        <Footer />
      </div>
    </div>
  );
}

export default Homepage;
