"use client"
import Backdrop from "./components/Backdrop";

export default function NotFound() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 text-stone-300">
      <Backdrop />
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 pt-12 lg:pt-24">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page not found</h2>
        <p className="text-xl mb-4">
          The page you are looking for does not exist.
        </p>
        <p className="text-lg mb-8">
          How you got here is a
          mystery. But you can click the button below to go back to the
          homepage.
        </p>

        <a
          href="/"
          className="hover:bg-stone-400 text-white font-bold py-2 px-4 rounded text-2xl"
        >
          Take me home!
        </a>
      </div>
    </div>
  );
}