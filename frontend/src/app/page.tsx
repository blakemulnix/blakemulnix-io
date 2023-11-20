import ExperienceSection from "./components/ExperienceSection";
import AboutMeSection from "./components/AboutMeSection";
import Header from "./components/Header";
import Backdrop from "./components/Backdrop";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 text-stone-100">
      <Backdrop />
      <div className="lg:flex lg:justify-between lg:gap-4">
        <Header />
        <main className="pt-24 lg:w-1/2 lg:py-24">
          <AboutMeSection />
          <ExperienceSection />
          <Footer />
        </main>
      </div>
    </div>
  );
}