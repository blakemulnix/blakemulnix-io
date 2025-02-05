import React from 'react'

const Header = () => {
  return (
    <header>
      <h1 className="text-3xl md:text-4xl min-[1900px]:text-5xl font-bold tracking-tight text-stone-100">My Photo Journal</h1>
      <p className="mt-4 lg:mb-8 text-sm md:text-base xl:text-lg min-[1900px]:text-xl tracking-wide font-medium leading-normal h-[5em] pr-2">
        just a guy with a camera and a bike, <br />
        wandering around the country
      </p>
    </header>
  )
}

export default Header
