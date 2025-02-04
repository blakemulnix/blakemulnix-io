import Navigation from './Navigation'
import SocialLinks from './SocialLinks'

const Header = () => {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-stone-100">Blake Mulnix</h1>
        <h2 className="mt-3 text-lg md:text-xl font-medium tracking-tight sm:text-xl text-stone-100">
          Software Consultant
        </h2>
        <p className="mt-4 lg:mb-8 max-w-xs md:text-md font-medium leading-normal h-[5em] pr-2">
          Helping teams build reliable and scalable software solutions.
        </p>
        <Navigation />
        <SocialLinks />
      </div>
    </header>
  )
}

export default Header
