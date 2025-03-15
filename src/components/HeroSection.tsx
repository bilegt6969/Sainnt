'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { PT_Serif } from 'next/font/google' // Import PT Serif

// Configure the font
const ptSerif = PT_Serif({
  weight: ['400', '700'], // Specify the font weights you need
  subsets: ['latin'], // Specify the subsets you need
  display: 'swap', // Ensure the font is displayed immediately
})

// Define the types
interface HeroImage {
  url: string
  width: number
  height: number
}

interface HeroData {
  id: string
  title: string
  description: string
  background: {
    type: 'image' | 'color'
    image?: HeroImage
    color?: string
  }
  textColor: string
  fontFamily: string
  textPosition: 'left' | 'center' | 'right'
}

const HeroSection = React.memo(() => {
  const [heroData, setHeroData] = useState<HeroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const response = await fetch('/api/hero-section')
        if (!response.ok) {
          throw new Error('Failed to fetch hero data')
        }
        const data = await response.json()
        setHeroData(data.docs[0]) // Assuming only one hero data is returned
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!heroData) return <div>No data available</div>

  // Determine the font family
  const fontFamily =
    heroData.fontFamily === 'PT Serif'
      ? ptSerif.className // Use the className from next/font
      : heroData.fontFamily === 'custom'
        ? heroData.customFont
        : heroData.fontFamily

  // Determine text alignment based on position
  const textAlignment =
    heroData.textPosition === 'left'
      ? 'text-left'
      : heroData.textPosition === 'right'
        ? 'text-right'
        : 'text-center'

  return (
    <section className="relative w-full h-[500px] md:h-[700px]">
      {/* Background: Image or Color */}
      {heroData.background.type === 'image' && heroData.background.image ? (
        <Image
          src={heroData.background.image.url}
          alt={heroData.title}
          width={heroData.background.image.width}
          height={heroData.background.image.height}
          className="absolute rounded-[5rem] inset-0 object-cover w-full h-full"
          priority
          loading="eager"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: heroData.background.color }}
        ></div>
      )}
      {/* Text container */}
      <div
        className={`relative z-10 container mx-auto px-4 py-24 ${textAlignment}`}
        style={{
          color: heroData.textColor,
          fontFamily: fontFamily,
        }}
      >
        <h1 className="text-4xl sm:text-6xl font-bold">{heroData.title}</h1>
        <p className="mt-4 text-lg sm:text-2xl">{heroData.description}</p>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export default HeroSection
