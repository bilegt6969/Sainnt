'use client'

import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface ItemData {
  id: string
  slug: string
  image_url: string
  lowest_price_cents: number
}

interface Item {
  data: ItemData
  value: string
}

interface ApiResponseItem {
  data: {
    id: string
    slug: string
    image_url: string
    lowest_price_cents: number
  }
  value: string
}

export default function BrandPageClient({ brand, brandData }: { brand: string; brandData?: any }) {
  const [products, setProducts] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrandProducts = async () => {
      try {
        const decodedBrand = decodeURIComponent(brand)
        const encodedBrand = encodeURIComponent(decodedBrand)
        const url = `https://ac.cnstrc.com/browse/brand/${encodedBrand}?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=38&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741721894207`

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const data = await response.json()

        if (!data.response || !data.response.results) {
          throw new Error('No results found.')
        }

        const formattedProducts = data.response.results.map((item: ApiResponseItem) => ({
          data: {
            id: item.data.id,
            slug: item.data.slug,
            image_url: item.data.image_url,
            lowest_price_cents: item.data.lowest_price_cents,
          },
          value: item.value,
        }))

        setProducts(formattedProducts)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch brand products:', error)
        notFound()
      }
    }

    fetchBrandProducts()
  }, [brand])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="font-extrabold text-white text-3xl my-8 relative">
          {decodeURIComponent(brand)} Products
        </h1>
        <Link className="text-white font-bold text-lg underline" href={`/brands/${brand}`}>
          View all {decodeURIComponent(brand)} Items
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-2">
        {products.map((item, idx) => (
          <Link href={`/product/${item.data.slug}`} key={item.data.id} passHref>
            <div
              className="text-white bg-black border border-neutral-800 rounded tracking-tight relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-neutral-600 hover:scale-[1.02] h-fit"
              style={{
                animationDelay: `${idx * 50}ms`,
                animation: 'fadeIn 0.5s ease-out forwards',
              }}
            >
              <div className="overflow-hidden rounded-lg relative" style={{ aspectRatio: '1/1' }}>
                <Image
                  className="rounded-lg mx-auto transition-transform duration-500 hover:scale-110 object-cover"
                  src={item.data.image_url}
                  alt={item.value}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority={idx < 6}
                />
              </div>

              <div className="w-full text-xs font-bold flex items-center border-t p-4 border-neutral-700 justify-between mt-4 relative group transition-all duration-300 hover:border-neutral-700">
                {item.value}

                <div className="bg-neutral-800 backdrop-brightness-90 border border-neutral-700 group-hover:bg-neutral-600 py-2 px-2 rounded-full whitespace-nowrap transition-all duration-300 ease-out min-w-[90px] text-center relative">
                  <span className="block group-hover:opacity-0 transition-opacity duration-300">
                    ${(item.data.lowest_price_cents / 100).toLocaleString()}
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Cart
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
