import React from 'react'

const Header = () => {
  return (
    <header className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl text-stone-100">Photo Journal</h1>
        <p className="mt-4 lg:mb-8 max-w-xs md:text-md font-medium leading-normal h-[5em] pr-2">
        Follow along on my road trips, gravel biking adventures, 
        and treks through our national forests and desert trails.
        </p>
      </div>
    </header>
  )
}

export default Header
