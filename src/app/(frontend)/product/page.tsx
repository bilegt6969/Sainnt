'use client'
import React, { useState, useEffect, useCallback, useRef, memo } from 'react'
import { useProductContext } from '../../context/ProductContext'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'

interface ItemData {
  id: string
  slug: string
  image_url: string
  lowest_price_cents: number
}

interface Item {
  data: ItemData
  value: string
  category: string
  categoryUrl: string
}

const Home = () => {
  const [data, setData] = useState<{ [key: string]: Item[] }>({})
  const [categoryData, setCategoryData] = useState<{ [key: string]: { [key: string]: Item[] } }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { setPageData } = useProductContext()
  const [mntRate, setMntRate] = useState<number | null>(null)
  const [activeProductIndex, setActiveProductIndex] = useState<{ [key: string]: number }>({})
  const [visibleSections, setVisibleSections] = useState<string[]>([])
  const sectionRefs = useRef<{ [key: string]: React.RefObject<HTMLDivElement> }>({})
  const urls = [
    'https://ac.cnstrc.com/browse/collection_id/top-trending-canada?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=5&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1740739279383',
    'https://ac.cnstrc.com/browse/collection_id/new-arrivals-apparel?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=4&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1740739819767',
    'https://ac.cnstrc.com/browse/collection_id/city-influence-paris?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1741630496727',
    'https://ac.cnstrc.com/browse/collection_id/goat-selects-newest?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1741630563',
    'https://ac.cnstrc.com/browse/collection_id/vintage-2023?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1741630658259',
    'https://ac.cnstrc.com/browse/collection_id/most-wanted-new?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=10&sort_by=relevance&sort_order=descending&_dt=1741630620395',
    'https://ac.cnstrc.com/browse/collection_id/new-in-supreme-ss25?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741632388083',
    'https://ac.cnstrc.com/browse/collection_id/styles-for-her?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741632409580',
    'https://ac.cnstrc.com/browse/collection_id/maximalist-sneakers?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741632433111',
    'https://ac.cnstrc.com/browse/collection_id/remixed-icon?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741632455571',
    'https://ac.cnstrc.com/browse/collection_id/remixed-icons-footwear?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741632478977',
    'https://ac.cnstrc.com/browse/collection_id/new-in-palace?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=24&sort_by=relevance&sort_order=descending&_dt=1741632526930',
  ]

  const ProductCategoryUrls = {
    el1: [
      'https://ac.cnstrc.com/browse/group_id/sneakers?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631177301',
      'https://ac.cnstrc.com/browse/group_id/apparel?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631218652',
      'https://ac.cnstrc.com/browse/group_id/bags?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631248845',
      'https://ac.cnstrc.com/browse/group_id/accessories?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=1&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631270463',
    ],
    el2: [
      'https://ac.cnstrc.com/browse/group_id/sneakers?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631433696',
      'https://ac.cnstrc.com/search/wmns?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&filters%5Bis_in_stock%5D=True&filters%5Bweb_groups%5D=sneakers&sort_by=relevance&sort_order=descending&_dt=1741631475282',
      'https://ac.cnstrc.com/search/gs?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631496746',
      'https://ac.cnstrc.com/search/PS?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631510849',
    ],
    el3: [
      'https://ac.cnstrc.com/browse/collection_id/vintage-2023?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631719966',
      'https://ac.cnstrc.com/browse/collection_id/instant?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741631771793',
      'https://ac.cnstrc.com/search/Tee?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&filters%5Bproduct_condition%5D=new_no_defects&sort_by=relevance&sort_order=descending&_dt=1741631831801',
      'https://ac.cnstrc.com/search/Hoodies?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&filters%5Bproduct_condition%5D=new_no_defects&sort_by=relevance&sort_order=descending&_dt=1741631856430',
    ],
    el4: [
      'https://ac.cnstrc.com/browse/group_id/hats?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&filters%5Bgroup_id%5D=hats&sort_by=relevance&sort_order=descending&_dt=1741632002858',
      'https://ac.cnstrc.com/browse/group_id/eyewear?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&filters%5Bgroup_id%5D=eyewear&sort_by=relevance&sort_order=descending&_dt=1741632030400',
      'https://ac.cnstrc.com/browse/group_id/tops?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741632052607',
      'https://ac.cnstrc.com/browse/group_id/bottoms?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741632082882',
    ],
    el5: [
      'https://ac.cnstrc.com/browse/group_id/sneakers?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741632131690',
      'https://ac.cnstrc.com/browse/brand/nike?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741632162861',
      'https://ac.cnstrc.com/search/ADIDAS?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741632196921',
      'https://ac.cnstrc.com/search/Jordan?c=ciojs-client-2.54.0&key=key_XT7bjdbvjgECO5d8&i=c1a92cc3-02a4-4244-8e70-bee6178e8209&s=34&page=1&num_results_per_page=3&sort_by=relevance&sort_order=descending&_dt=1741632226626',
    ],
  }

  // Function to replace "GOAT" with "Saint" and "Canada" with "Mongol"
  const replaceText = (text: string) => {
    return text.replace(/GOAT/gi, 'SAINT').replace(/Canada/gi, 'MONGOLIA')
  }

  const observeSections = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id')
          if (id && entry.isIntersecting && !visibleSections.includes(id)) {
            setVisibleSections((prev) => [...prev, id])
          }
        })
      },
      { threshold: 0.1, rootMargin: '200px' },
    )

    Object.keys(data).forEach((_, index) => {
      const sectionId = `section-${index}`
      if (sectionRefs.current[sectionId]?.current) {
        observer.observe(sectionRefs.current[sectionId].current!)
      }
    })

    return () => observer.disconnect()
  }, [data, visibleSections])

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true)

      const firstUrlResponse = await fetch(urls[0])
      const firstUrlData = await firstUrlResponse.json()

      const categorizedResults: { [key: string]: Item[] } = {}

      if (firstUrlData.response?.collection) {
        const category = firstUrlData.response.collection.display_name || 'Unknown Category'
        const categoryUrl = firstUrlData.response.collection.id || 'Unknown URL'

        categorizedResults[category] =
          firstUrlData.response.results?.map((item: any) => ({
            data: item.data,
            value: item.value,
            category,
            categoryUrl,
          })) || []
      }

      const categoryResults: { [key: string]: { [key: string]: Item[] } } = {}
      const elKey = 'el1'

      if (ProductCategoryUrls[elKey]) {
        const categoryResponses = await Promise.all(
          ProductCategoryUrls[elKey].map((url) => fetch(url)),
        )
        const categoryJsonData = await Promise.all(categoryResponses.map((res) => res.json()))

        categoryResults[elKey] = {}

        categoryJsonData.forEach((res, idx) => {
          if (!res.response?.results || res.response.results.length === 0) return

          let label: string
          if (res.response.collection?.display_name) {
            label = res.response.collection.display_name
          } else if (res.request?.term) {
            label = res.request.term.charAt(0).toUpperCase() + res.request.term.slice(1)
          } else {
            const staticLabels = ['Sneakers', 'Apparel', 'Bags', 'Accessories']
            label = staticLabels[idx] || `Category ${idx + 1}`
          }

          let url = ''

          if (res.response.collection) {
            url = res.response.collection.id || '#'
          } else if (res.request?.term) {
            url = `/search/${res.request.term}`
          } else if (res.response.facets?.group_id) {
            url = `/browse/group_id/${res.response.facets.group_id.values[0].value}`
          } else {
            url = '#'
          }

          const products = res.response.results.slice(0, 3).map((product: any) => ({
            data: product.data,
            value: label,
            category: label,
            categoryUrl: url,
          }))

          categoryResults[elKey][label] = products
        })
      }

      setData(categorizedResults)
      setCategoryData(categoryResults)
      setPageData(categorizedResults)

      const initialActiveIndex: { [key: string]: number } = {}
      Object.keys(categoryResults).forEach((elKey) => {
        Object.keys(categoryResults[elKey]).forEach((category) => {
          const key = `${elKey}-${category}`
          initialActiveIndex[key] = 1
        })
      })
      setActiveProductIndex(initialActiveIndex)

      setVisibleSections(['section-0'])
    } catch (err) {
      console.error('Failed to fetch initial data:', err)
      setError('Error fetching data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [setPageData])

  const fetchRemainingData = useCallback(async () => {
    try {
      const responses = await Promise.all(urls.slice(1).map((url) => fetch(url)))
      const jsonData = await Promise.all(responses.map((res) => res.json()))

      const newCategorizedResults = { ...data }

      jsonData.forEach((res) => {
        if (!res.response?.collection) return

        const category = res.response.collection.display_name || 'Unknown Category'
        const categoryUrl = res.response.collection.id || 'Unknown URL'

        newCategorizedResults[category] =
          res.response.results?.map((item: any) => ({
            data: item.data,
            value: item.value,
            category,
            categoryUrl,
          })) || []
      })

      const newCategoryResults = { ...categoryData }

      for (let i = 2; i <= 5; i++) {
        const elKey = `el${i}` as keyof typeof ProductCategoryUrls
        if (ProductCategoryUrls[elKey]) {
          const categoryResponses = await Promise.all(
            ProductCategoryUrls[elKey].map((url) => fetch(url)),
          )
          const categoryJsonData = await Promise.all(categoryResponses.map((res) => res.json()))

          newCategoryResults[elKey] = {}

          categoryJsonData.forEach((res, idx) => {
            if (!res.response?.results || res.response.results.length === 0) return

            let label: string
            if (res.response.collection?.display_name) {
              label = res.response.collection.display_name
            } else if (res.request?.term) {
              label = res.request.term.charAt(0).toUpperCase() + res.request.term.slice(1)
            } else {
              const staticLabels = {
                el2: ['All Sneakers', "Women's Sneakers", 'Grade School', 'Pre School'],
                el3: ['Vintage', 'Instant Ship', 'Tees', 'Hoodies'],
                el4: ['Hats', 'Eyewear', 'Tops', 'Bottoms'],
                el5: ['All Sneakers', 'Nike', 'Adidas', 'Jordan'],
              }
              label = staticLabels[elKey][idx] || `Category ${idx + 1}`
            }

            let url = ''

            if (res.response.collection) {
              url = res.response.collection.id || '#'
            } else if (res.request?.term) {
              url = `/search/${res.request.term}`
            } else if (res.response.facets?.group_id) {
              url = `/browse/group_id/${res.response.facets.group_id.values[0].value}`
            } else {
              url = '#'
            }

            const products = res.response.results.slice(0, 3).map((product: any) => ({
              data: product.data,
              value: label,
              category: label,
              categoryUrl: url,
            }))

            newCategoryResults[elKey][label] = products
          })
        }
      }

      setData(newCategorizedResults)
      setCategoryData(newCategoryResults)
      setPageData(newCategorizedResults)

      const newActiveIndex = { ...activeProductIndex }
      Object.keys(newCategoryResults).forEach((elKey) => {
        if (elKey !== 'el1') {
          Object.keys(newCategoryResults[elKey] || {}).forEach((category) => {
            const key = `${elKey}-${category}`
            if (newActiveIndex[key] === undefined) {
              newActiveIndex[key] = 1
            }
          })
        }
      })
      setActiveProductIndex(newActiveIndex)
    } catch (err) {
      console.error('Failed to fetch remaining data:', err)
    }
  }, [data, categoryData, activeProductIndex, setPageData])

  const fetchCurrencyData = useCallback(async () => {
    try {
      const res = await fetch('https://hexarate.paikama.co/api/rates/latest/USD?target=MNT')
      const data = await res.json()

      if (data.status_code === 200 && data.data) {
        setMntRate(data.data.mid)
      } else {
        setError('MNT rate not available')
      }
    } catch (error) {
      setError('Failed to fetch currency data')
    }
  }, [])

  useEffect(() => {
    for (let i = 0; i < 12; i++) {
      sectionRefs.current[`section-${i}`] = React.createRef()
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchInitialData(), fetchCurrencyData()])
  }, [fetchInitialData, fetchCurrencyData])

  useEffect(() => {
    const observer = observeSections()
    return () => observer()
  }, [observeSections])

  useEffect(() => {
    let isRemainingDataFetched = false

    const handleScroll = () => {
      if (!isRemainingDataFetched && window.scrollY > 300) {
        fetchRemainingData()
        isRemainingDataFetched = true
        window.removeEventListener('scroll', handleScroll)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchRemainingData])

  const renderCarousel = (items: Item[], title: string) => {
    return (
      <Swiper
        slidesPerView={1.5} // Show 1.5 slides at a time on mobile
        spaceBetween={16} // Space between slides
        pagination={{ clickable: true }} // Add pagination dots
        className="mySwiper"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item.data.id}>
            <Link href={`/product/${item.data.slug}`} passHref>
              <div className="text-white bg-black border border-neutral-800 rounded tracking-tight relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-neutral-600 hover:scale-[1.02] h-full flex flex-col">
                {/* Price Tag on Top (Mobile Only) */}
                <div className="block lg:hidden w-full text-xs font-bold flex items-center p-4 bg-black backdrop-brightness-90 border-b border-neutral-700">
                  <span className="block">
                    MNT {Math.ceil((item.data.lowest_price_cents * mntRate) / 100).toLocaleString()}
                  </span>
                </div>

                {/* Image */}
                <div
                  className="overflow-hidden rounded-lg relative flex-grow"
                  style={{ aspectRatio: '1/1' }}
                >
                  <Image
                    className="rounded-lg mx-auto transition-transform duration-500 hover:scale-110 object-cover"
                    src={item.data.image_url}
                    alt={item.value}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx < 6}
                  />
                </div>

                {/* Price Tag Below Image (Desktop Only) */}
                <div className="hidden lg:flex w-full text-xs font-bold flex items-center p-4 border-t border-neutral-700 justify-between relative group transition-all duration-300 hover:border-neutral-700">
                  <span className="block">
                    MNT {Math.ceil((item.data.lowest_price_cents * mntRate) / 100).toLocaleString()}
                  </span>
                </div>

                {/* Description Below Image */}
                <div className="w-full text-xs font-bold flex items-center p-4 border-t border-neutral-700 justify-between relative group transition-all duration-300 hover:border-neutral-700">
                  {replaceText(item.value)} {/* Apply text replacement */}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    )
  }

  const renderCategoryCarousel = (items: Item[], title: string) => {
    return (
      <Swiper
        slidesPerView={1.5} // Show 1.5 slides at a time on mobile
        spaceBetween={16} // Space between slides
        pagination={{ clickable: true }} // Add pagination dots
        modules={[Pagination]}
        className="mySwiper"
      >
        {items.map((item, idx) => (
          <SwiperSlide key={item.data.id}>
            <Link href={`/product/${item.data.slug}`} passHref>
              <div className="text-white bg-black border border-neutral-800 rounded tracking-tight relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-neutral-600 hover:scale-[1.02] h-full flex flex-col">
                {/* Price Tag on Top (Mobile Only) */}
                <div className="block lg:hidden w-full text-xs font-bold flex items-center p-2 bg-neutral-800 backdrop-brightness-90 border-b border-neutral-700">
                  <span className="block">
                    MNT {Math.ceil((item.data.lowest_price_cents * mntRate) / 100).toLocaleString()}
                  </span>
                </div>

                {/* Image */}
                <div
                  className="overflow-hidden rounded-lg relative flex-grow"
                  style={{ aspectRatio: '1/1' }}
                >
                  <Image
                    className="rounded-lg mx-auto transition-transform duration-500 hover:scale-110 object-cover"
                    src={item.data.image_url}
                    alt={item.value}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={idx < 6}
                  />
                </div>

                {/* Price Tag Below Image (Desktop Only) */}
                <div className="hidden lg:flex w-full text-xs font-bold flex items-center p-4 border-t border-neutral-700 justify-between relative group transition-all duration-300 hover:border-neutral-700">
                  <span className="block">
                    MNT {Math.ceil((item.data.lowest_price_cents * mntRate) / 100).toLocaleString()}
                  </span>
                </div>

                {/* Description Below Image */}
                <div className="w-full text-xs font-bold flex items-center p-4 border-t border-neutral-700 justify-between relative group transition-all duration-300 hover:border-neutral-700">
                  {replaceText(item.value)} {/* Apply text replacement */}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    )
  }

  const renderCategoryItems = (elKey: string) => {
    if (!categoryData[elKey]) return null

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
        {Object.entries(categoryData[elKey]).map(([label, items], idx) => (
          <div
            key={idx}
            className="text-white rounded tracking-tight relative bg-black border-white cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:scale-[1.02] h-fit"
          >
            <Link href={items[0]?.categoryUrl || '#'} passHref>
              <div className="w-full flex justify-between items-center text-xl font-bold bg-white text-black p-4 border-b border-neutral-700 mt-0 relative transition-all duration-300 hover:border-neutral-700">
                <span>{replaceText(label)}</span> {/* Apply text replacement */}
                <ChevronRight className="h-5 w-5" />
              </div>
            </Link>
            <div
              className="relative overflow-hidden border border-neutral-700"
              style={{ aspectRatio: '1/1', backgroundColor: 'transparent' }}
            >
              {/* Left Image (30% larger) */}
              {items[0] && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-1/2 flex items-center justify-start"
                  style={{ zIndex: 1 }}
                >
                  <div className="relative" style={{ width: '130%', height: '130%' }}>
                    <Image
                      className="object-contain w-full h-full"
                      src={items[0].data.image_url}
                      alt={`${label} product 1`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx < 4}
                    />
                  </div>
                </div>
              )}
              {/* Middle Image (original size) */}
              {items[1] && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: 2 }}
                >
                  <div className="relative" style={{ width: '75%', height: '75%' }}>
                    <Image
                      className="object-contain w-full h-full"
                      src={items[1].data.image_url}
                      alt={`${label} product 2`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx < 4}
                    />
                  </div>
                </div>
              )}
              {/* Right Image (30% larger) */}
              {items[2] && (
                <div
                  className="absolute right-0 top-0 bottom-0 w-1/2 flex items-center justify-end"
                  style={{ zIndex: 1 }}
                >
                  <div className="relative" style={{ width: '130%', height: '130%' }}>
                    <Image
                      className="object-contain w-full h-full"
                      src={items[2].data.image_url}
                      alt={`${label} product 3`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={idx < 4}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isLoading || mntRate === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-10 w-40 bg-neutral-800 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-neutral-800 rounded-2xl h-80 w-full"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-900/20 border border-red-700 p-6 rounded-lg text-red-400">
          <p>{error}</p>
          <button
            onClick={() => Promise.all([fetchInitialData(), fetchCurrencyData()])}
            className="mt-4 bg-red-700 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {Object.entries(data).map(([title, items], index) => {
        if (!sectionRefs.current[`section-${index}`]) {
          sectionRefs.current[`section-${index}`] = React.createRef()
        }

        const elKey = `el${Math.min(index + 1, 5)}` as keyof typeof categoryData

        const shouldRender = visibleSections.includes(`section-${index}`)

        return (
          <div
            key={index}
            className="mb-16"
            ref={sectionRefs.current[`section-${index}`]}
            data-section-id={`section-${index}`}
          >
            {shouldRender ? (
              <>
                <div className="flex justify-between items-center">
                  <h1 className="font-extrabold text-white text-lg md:text-3xl my-8 relative">
                    {replaceText(title)} {/* Apply text replacement */}
                  </h1>
                  <Link
                    className="text-white font-semibold text-[0.5rem] md:text-lg underline"
                    href={items[0]?.categoryUrl || '#'}
                  >
                    View all Items
                  </Link>
                </div>

                {/* Render carousel for mobile and tablets */}
                <div className="block lg:hidden">{renderCarousel(items, title)}</div>

                {/* Render grid for desktop */}
                <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
                  {items.map((item, idx) => (
                    <Link href={`/product/${item.data.slug}`} key={item.data.id} passHref>
                      <div className="text-white bg-black border border-neutral-700 rounded tracking-tight relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-neutral-600 hover:scale-[1.02] h-full flex flex-col">
                        {/* Price Tag on Top (Mobile Only) */}
                        <div className="block lg:hidden w-full text-xs font-bold flex items-center p-2 bg-neutral-800 backdrop-brightness-90 border-b border-neutral-700">
                          <span className="block">
                            MNT{' '}
                            {Math.ceil(
                              (item.data.lowest_price_cents * mntRate) / 100,
                            ).toLocaleString()}
                          </span>
                        </div>

                        {/* Image */}
                        <div
                          className="overflow-hidden rounded-lg relative flex-grow"
                          style={{ aspectRatio: '1/1' }}
                        >
                          <Image
                            className="rounded-lg mx-auto transition-transform duration-500 hover:scale-110 object-cover"
                            src={item.data.image_url}
                            alt={item.value}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={idx < 6}
                          />
                        </div>

                        {/* Price Tag Below Image (Desktop Only) */}

                        {/* Description Below Image */}
                        <div className="w-full text-xs font-bold flex items-center p-4 border-t border-neutral-700 justify-between relative group transition-all duration-300 hover:border-neutral-700">
                          {replaceText(item.value)} {/* Apply text replacement */}
                          <div className="bg-neutral-800 backdrop-brightness-90 border border-neutral-700 group-hover:bg-neutral-600 py-2 px-2 rounded-full whitespace-nowrap transition-all duration-300 ease-out min-w-[90px] text-center relative">
                            <span className="block group-hover:opacity-0 transition-opacity duration-300">
                              ₮{' '}
                              {Math.ceil(
                                (item.data.lowest_price_cents * mntRate) / 100,
                              ).toLocaleString()}
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

                <div className="mt-[10rem]">{renderCategoryItems(elKey)}</div>
              </>
            ) : (
              <div className="animate-pulse">
                <div className="h-10 w-40 bg-neutral-800 rounded-lg mb-8 mt-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-neutral-800 rounded-2xl h-80 w-full"></div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
      <style jsx global>{`
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

        .carousel-container {
          position: relative;
          overflow: hidden;
        }

        .carousel-main {
          display: block;
          position: relative;
        }

        .carousel-vertical {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
        }

        .carousel-vertical::-webkit-scrollbar {
          width: 6px;
        }

        .carousel-vertical::-webkit-scrollbar-track {
          background: transparent;
        }

        .carousel-vertical::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
      `}</style>
    </div>
  )
}

export default memo(Home)
