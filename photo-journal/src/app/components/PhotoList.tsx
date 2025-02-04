'use client'

import { useInView } from 'react-intersection-observer'
import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Photo {
  id: string
  url: string
  alt: string
  width: number
  height: number
}

interface Trip {
  id: string
  name: string
  date: string
  location: string
}

const Footer = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [page, setPage] = useState(1)
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null)
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { ref, inView } = useInView()

  const loadMoreTrips = useCallback(async () => {
    const response = await fetch(`/api/trips?page=${page}`)
    const newTrips: Trip[] = await response.json()
    setTrips((prev) => [...prev, ...newTrips])
    setPage((prev) => prev + 1)
  }, [page])

  useEffect(() => {
    if (inView) {
      loadMoreTrips()
    }
  }, [inView, loadMoreTrips])

  const openSlideShow = (trip: Trip, index: number) => {
    setSelectedTrip(trip)
    setSelectedPhotoIndex(index)
    setIsModalOpen(true)
  }

  return (
    <div>
      <div>
        <div className="lg:flex lg:justify-between lg:gap-4">
            <div className="flex flex-col gap-4 mb-8">
              {trips.map((trip) => (
                <section key={trip.id} className="mb-12" onClick={() => setIsModalOpen(true)}>
                  <h2 className="text-xl font-bold mb-2">{trip.date}</h2>
                  <h3 className="text-lg mb-4">{trip.location}</h3>
                </section>
              ))}
            </div>
            <div ref={ref} className="h-10" />
        </div>
      </div>

      {/* Modal Slideshow */}
      {isModalOpen && selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-white text-2xl">
            ×
          </button>

          <div className="relative w-full h-full flex items-center justify-center">
            modal!
          </div>
        </div>
      )}
    </div>
  )
}

export default Footer
