import Header from './components/Header'
import Footer from './components/Footer'
import LoadingScreenContainer from './components/LoadingScreenContainer'
import React from 'react'
import PhotoList from './components/PhotoList'

export default function Page() {
  const contentContainerStyle = `mx-auto min-h-screen max-w-screen-xl min-[1900px]:max-w-screen-2xl px-6 py-12 md:px-12 md:py-20 lg:px-24 lg:py-0 text-stone-100`

  return (
    <LoadingScreenContainer>
      <div className={contentContainerStyle}>
        <div className="lg:flex lg:justify-between gap-4 lg:gap-24 xl:gap-36">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-2/5 xl:w-1/3 lg:flex-col lg:justify-between lg:py-24">
            <Header />
            <Footer className="hidden lg:block" />
          </div>
          <main className="pt-2 md:pt-8 lg:w-3/5 xl:w-2/3 lg:py-24">
            <PhotoList />
            <Footer className="lg:hidden" />
          </main>
        </div>
      </div>
    </LoadingScreenContainer>
  )
}
