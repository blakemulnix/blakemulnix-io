import TerminalNavBar from "./components/TerminalNavBar";
import TerminalScreen from "./components/TerminalScreen";
import Footer from "./components/Footer";

export function Homepage() {
  return (
    <div className="bg-gradient-to-br from-stone-800 to-stone-950 text-white font-mono">
      <div className="h-screen mx-auto w-full max-w-screen-xl flex flex-col md:py-6">
        <TerminalNavBar />
        <TerminalScreen />
        <Footer />
      </div>
    </div>
  );
}

export default Homepage;
