'use client'

import { useSearchParams } from 'next/navigation.js'
import { useState, useEffect, useCallback } from 'react' // Add useCallback
import Link from 'next/link.js'
import Image from 'next/image.js'

const SearchPage = () => {
  const [data, setData] = useState<Product[]>([])
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1) // Track the current page
  const [hasMore, setHasMore] = useState(true) // Track if there are more products to load
  const searchParams = useSearchParams()
  const query = searchParams.get('query')

  // Encode the query to replace spaces with %20
  const encodedQuery = query ? query.replace(/ /g, '%20') : ''

  interface ProductData {
    id: string
    slug: string
    image_url: string
    lowest_price_cents: number
  }

  interface Product {
    data: ProductData
    value: string
  }

  // Memoize fetchData with useCallback
  const fetchData = useCallback(
    async (page: number): Promise<Product[]> => {
      try {
        const url = `https://ac.cnstrc.com/search/${encodedQuery}?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=37&page=${page}&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741715382729`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Failed to fetch data')
        const result = await res.json()
        return result.response.results || []
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
        return []
      }
    },
    [encodedQuery],
  )

  // Initial data fetch
  useEffect(() => {
    const loadInitialData = async () => {
      const newData = await fetchData(1)
      setData(newData)
      setHasMore(newData.length > 0) // Check if there are more products to load
    }

    if (encodedQuery) {
      loadInitialData()
    }
  }, [encodedQuery, fetchData]) // Add fetchData to the dependency array

  // Infinite scroll: Load more data when the user scrolls to the bottom
  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 && // Trigger 100px before the bottom
        hasMore
      ) {
        const nextPage = page + 1
        const newData = await fetchData(nextPage)

        if (newData.length > 0) {
          setData((prevData) => [...prevData, ...newData]) // Append new data
          setPage(nextPage) // Update the page number
        } else {
          setHasMore(false) // No more products to load
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page, hasMore, fetchData]) // Add fetchData to the dependency array

  // Filter out products without images
  const productsWithImages = data.filter((item) => item.data.image_url)

  return (
    <div className="text-white">
      <h1>Search Results</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-5 gap-2 text-xs">
          {productsWithImages.length > 0 ? (
            productsWithImages.map((item, index) => (
              <Link
                href={`/product/${item.data.slug}`}
                key={`${item.data.id}-${index}`} // Use a unique key
                passHref
              >
                <div className="text-white bg-black border border-neutral-800 hover:border-neutral-600 tracking-tight relative cursor-pointer transition-all hover:shadow-lg hover:scale-[1.008]">
                  <Image
                    className="rounded-lg p-4 mx-auto"
                    src={item.data.image_url}
                    alt={item.value}
                    width={600}
                    height={600}
                    style={{ objectFit: 'cover' }}
                    loading="lazy" // Add lazy loading
                  />
                  <div className="text-sm font-bold flex items-center justify-between mt-4 border-t py-3 px-4 border-neutral-800">
                    <p className="text-xs">{item.value}</p>
                    <p className="group bg-neutral-800 backdrop-brightness-50 border border-neutral-700 p-1 rounded-full transition-colors duration-300 flex items-center justify-center min-w-[120px] hover:bg-green-600">
                      <span className="group-hover:hidden text-xs">
                        ₮{' '}
                        {Math.round(
                          ((item.data.lowest_price_cents * 1.2) / 100) * 3450,
                        ).toLocaleString()}
                      </span>
                      <span className="hidden group-hover:block transform scale-120">Buy</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-white text-center w-full">No products found.</p>
          )}
        </div>
      )}

      {/* Show a loading spinner or message when fetching more data */}
      {hasMore && (
        <div className="text-center my-4">
          <p className="text-neutral-400">Loading more products...</p>
        </div>
      )}
    </div>
  )
}

export default SearchPage
