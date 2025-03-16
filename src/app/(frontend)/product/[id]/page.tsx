'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import useCartStore from '../../../store/cartStore'
import { toast, Toaster } from 'sonner'

interface PriceData {
  sizeOption?: {
    presentation: string
  }
  lastSoldPriceCents?: {
    amount: number | null | undefined
  }
  stockStatus: string
  shoeCondition: string
  boxCondition: string
}

interface Product {
  id: string
  name: string
  productCategory: string
  productType: string
  color: string
  brandName: string
  details: string
  gender: string[]
  midsole: string
  mainPictureUrl: string
  releaseDate: string
  slug: string
  upperMaterial: string
  singleGender: string
  story: string
  productTemplateExternalPictures?: {
    mainPictureUrl: string
  }[]
  localizedSpecialDisplayPriceCents?: {
    amountUsdCents: number
  }
}

interface ApiResponse {
  data: {
    pageProps: {
      productTemplate: Product
    }
  }
  PriceData: PriceData[]
  recommendedProducts: Product[]
  productId: PriceData[]
  PriceTagUrl: PriceData[]
  recommendedUrl: PriceData[]
}

// Function to convert US shoe sizes to EU sizes
const convertUSToEUSize = (usSize: string) => {
  const usSizes = Array.from({ length: 31 }, (_, i) => i.toString()) // Sizes from 0 to 30
  const euSizes = Array.from({ length: 31 }, (_, i) => (i + 34).toString()) // EU sizes from 34 to 64

  const index = usSizes.indexOf(usSize)
  return index !== -1 ? euSizes[index] : usSize // Return original size if not found
}

function Page() {
  const [data, setData] = useState<ApiResponse['data'] | null>(null)
  const [Pricedata, setPriceData] = useState<PriceData[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [fade, setFade] = useState(false)
  const [offerType, setOfferType] = useState('new')
  const pathname = usePathname()
  const RawSlug = pathname.split('/product/')
  const Slug = RawSlug[1] || 'default-slug'
  const [isOpen, setIsOpen] = useState(false)
  const [selectedSize, setSelectedSize] = useState('Select Size')
  const [_PriceArrayData, _setPriceArrayData] = useState<PriceData[]>([])
  const [mntRate, setMntRate] = useState<number | null>(null)
  const [_error1, _setError1] = useState<string | null>(null)

  const [NewType_Product, setNewTypeProduct] = useState<PriceData[]>([])
  const [UsedType_Product, setUsedTypeProduct] = useState<PriceData[]>([])
  const [OfferType_Product, setOfferTypeProduct] = useState<PriceData[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])

  const addToCart = useCartStore((state) => state.addToCart)

  // Toggle dropdown visibility
  const toggleDropdown = () => setIsOpen(!isOpen)

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)
    setIsOpen(false)
  }

  // Fetch currency data
  useEffect(() => {
    const fetchCurrencyData = async () => {
      try {
        const res = await fetch('/api/getcurrencydata')
        const data = await res.json()
        if (data.mnt) {
          setMntRate(data.mnt)
        } else {
          _setError1('MNT rate not available')
        }
      } catch (_error) {
        _setError1('Failed to fetch currency data')
      }
    }
    fetchCurrencyData()
  }, [])

  // Fetch product data and recommended products
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/hey?slug=${Slug}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result: ApiResponse = await response.json()

        const AvailableProducts =
          result.PriceData?.filter(
            (item) =>
              item.stockStatus === 'multiple_in_stock' || item.stockStatus === 'single_in_stock',
          ) || [] // Fallback to empty array if undefined

        setNewTypeProduct(
          AvailableProducts.filter(
            (item) =>
              item.shoeCondition === 'new_no_defects' && item.boxCondition === 'good_condition',
          ) || [], // Fallback to empty array
        )

        setUsedTypeProduct(
          AvailableProducts.filter((item) => item.shoeCondition === 'used') || [], // Fallback to empty array
        )

        setOfferTypeProduct(
          AvailableProducts.filter(
            (item) =>
              item.shoeCondition === 'new_no_defects' ||
              item.shoeCondition === 'new_with_defects' ||
              item.boxCondition === 'good_condition' ||
              item.boxCondition === 'badly_damaged' ||
              item.boxCondition === 'no_original_box',
          ) || [], // Fallback to empty array
        )
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('An unknown error occurred')
        }
      }
    }

    fetchData()
  }, [Slug])

  if (error) return <div className="text-red-500">Error: {error}</div>
  if (!data && !Pricedata) return <div className="text-white">Loading...</div>

  const product = data?.pageProps?.productTemplate
  if (!product) return <div className="text-white">No product data available.</div>

  const images = product.productTemplateExternalPictures?.map((img) => img.mainPictureUrl) || []

  const handlePreviousImage = () => {
    setFade(true)
    setTimeout(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
      setFade(false)
    }, 200)
  }

  const handleNextImage = () => {
    setFade(true)
    setTimeout(() => {
      setSelectedImageIndex((prevIndex) => (prevIndex + 1) % images.length)
      setFade(false)
    }, 200)
  }

  const TailoredSize =
    offerType === 'new'
      ? (NewType_Product ?? [])
      : offerType === 'used'
        ? (UsedType_Product ?? [])
        : offerType === 'offer'
          ? (OfferType_Product ?? [])
          : []

  const sizeOptions = [
    ...new Set(TailoredSize?.map((item: PriceData) => item.sizeOption?.presentation)),
  ]

  const King = TailoredSize.filter(
    (item: PriceData) => item.sizeOption?.presentation === selectedSize,
  )

  if (mntRate === null) {
    return <div>Loading currency data...</div>
  }

  const handleAddToCart = async () => {
    if (King.length > 0) {
      const priceCents = King[0].lastSoldPriceCents?.amount
      if (priceCents === null || priceCents === undefined || priceCents === 0) {
        toast.error('Price is unavailable.')
        return
      }
      const price = ((King[0].lastSoldPriceCents?.amount ?? 0) * mntRate) / 100
      addToCart(product, selectedSize, price)
      toast.success('Added to cart!')
    } else {
      toast.error('Please select a size.')
    }
  }

  // Check if each product type has available products
  const hasNewProducts = NewType_Product.length > 0
  const hasUsedProducts = UsedType_Product.length > 0
  const hasOfferProducts = OfferType_Product.length > 0

  return (
    <div className="">
      <div className="bg-black border border-neutral-700 p-8 rounded-3xl">
        {/* Product Details Section */}
        <div className="h-fit max-h-[] w-full flex flex-col lg:flex-row gap-8">
          {/* Left Column: Product Image */}
          <div className="flex flex-col items-center relative bg-white rounded-2xl w-full lg:w-1/2">
            {/* Image Display */}
            <div className="relative h-[700px] w-full flex items-center justify-center bg-white rounded-2xl overflow-hidden">
              {images.length > 0 ? (
                <Image
                  src={images[selectedImageIndex]}
                  alt="Product Image"
                  width={800}
                  height={900}
                  className={`object-cover transition-opacity duration-500 ease-in-out ${
                    fade ? 'opacity-0' : 'opacity-100'
                  }`}
                />
              ) : (
                <p className="text-black">No image available</p>
              )}

              {/* Image Navigation Buttons */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex h-11 items-center rounded-full border text-neutral-400 backdrop-blur-sm border-black bg-neutral-900/80">
                    <button
                      onClick={handlePreviousImage}
                      className="p-2 rounded-full hover:bg-neutral-700"
                    >
                      <ArrowLeftIcon className="h-5" />
                    </button>
                    <div className="mx-1 h-6 w-px bg-neutral-400"></div>
                    <button
                      onClick={handleNextImage}
                      className="p-2 rounded-full hover:bg-neutral-700"
                    >
                      <ArrowRightIcon className="h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Selector */}
            <div className="flex gap-2 mt-3 mb-4">
              {images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`border-[2px] p-2 rounded-lg ${
                    selectedImageIndex === index ? 'border-blue-700' : 'border-neutral-900'
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    width={50}
                    height={50}
                    className="rounded object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className="text-white flex flex-col justify-start items-start w-full lg:w-1/2 p-4">
            {product ? (
              <>
                <span className="flex space-x-1">
                  <p className="underline">{product.productCategory}</p>
                  <p>/</p>
                  <p className="underline">{product.productType}</p>
                </span>

                <h1 className="text-[45px] tracking-tight leading-[50px] font-bold">
                  {product.name}
                </h1>

                <div className="bg-neutral-600 w-full h-[1px] my-10"></div>
                <div className="space-y-4">
                  {/* Toggle between New/Used */}
                  <div className="flex space-x-2 bg-neutral-800 p-1 rounded-full border border-neutral-700 items-center justify-center">
                    <button
                      className={`text-base ${
                        offerType === 'new' ? 'bg-black text-white' : 'bg-transparent'
                      } border py-2 px-4 border-neutral-800 font-semibold rounded-full inline-block transition-all duration-300 ease-in-out ${
                        !hasNewProducts ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => setOfferType('new')}
                      disabled={!hasNewProducts}
                    >
                      New
                    </button>

                    <button
                      className={`text-base ${
                        offerType === 'used' ? 'bg-black text-white' : 'bg-transparent'
                      } border py-2 px-4 border-neutral-800 font-semibold rounded-full inline-block transition-all duration-300 ease-in-out ${
                        !hasUsedProducts ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => setOfferType('used')}
                      disabled={!hasUsedProducts}
                    >
                      Used
                    </button>

                    <button
                      className={`text-base ${
                        offerType === 'offer' ? 'bg-black text-white' : 'bg-transparent'
                      } border py-2 px-4 border-neutral-800 font-semibold rounded-full inline-block transition-all duration-300 ease-in-out ${
                        !hasOfferProducts ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      onClick={() => setOfferType('offer')}
                      disabled={!hasOfferProducts}
                    >
                      Offer
                    </button>
                  </div>
                </div>

                {/* Size selection */}
                <div className="relative text-left w-full space-y-4 mt-4">
                  <button
                    onClick={toggleDropdown}
                    className="w-full bg-neutral-800 flex border justify-between font-semibold border-neutral-700 text-white px-2 py-2 rounded-full shadow-md focus:outline-none transition-transform duration-300 ease-in-out items-center"
                  >
                    <div className="flex w-full justify-between px-4 py-2 items-center rounded-full bg-neutral-900 border border-neutral-700">
                      <p className="">Size:</p>

                      <div className="flex space-x-4 items-center border border-neutral-700 bg-black px-4 py-2 rounded-full">
                        <p>
                          {selectedSize.includes('US')
                            ? `${selectedSize} (EU ${convertUSToEUSize(
                                selectedSize.replace('US ', ''),
                              )})`
                            : selectedSize}
                        </p>
                        <ChevronDownIcon className="h-5" />
                      </div>
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      className={`origin-top-left absolute left-0 mt-2 w-full h-min rounded-2xl shadow-lg bg-neutral-800 border border-neutral-700 transform ${
                        isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'
                      }`}
                      style={{
                        transformOrigin: 'top',
                        transitionProperty: 'transform, opacity',
                      }}
                    >
                      <div className="grid grid-cols-3 gap-2 p-4">
                        {sizeOptions.map((size) => (
                          <button
                            key={size}
                            onClick={() => handleSizeSelect(size ?? '')}
                            className="block w-full px-4 py-2 text-sm bg-black border border-neutral-700 p-1 rounded-xl text-center text-white hover:bg-neutral-900 transition-colors duration-200"
                          >
                            {size && size.includes('US')
                              ? `${size} (EU ${convertUSToEUSize(size.replace('US ', ''))})`
                              : size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div>No product details available</div>
            )}
            <div className="w-full bg-neutral-800 border border-neutral-700 mt-4 p-8 rounded-2xl font-semibold">
              {King.length > 0 ? (
                <div className="">
                  <h1>Buy Now for</h1>
                  <span className="text-2xl">
                    {King[0].lastSoldPriceCents?.amount === null ||
                    King[0].lastSoldPriceCents?.amount === undefined ||
                    King[0].lastSoldPriceCents?.amount === 0
                      ? 'Unavailable'
                      : `₮ ${(
                          ((King[0].lastSoldPriceCents?.amount ?? 0) * mntRate) /
                          100
                        ).toLocaleString()}`}
                  </span>
                  <div className="">
                    <button
                      onClick={handleAddToCart}
                      disabled={
                        King[0].lastSoldPriceCents?.amount === null ||
                        King[0].lastSoldPriceCents?.amount === undefined ||
                        King[0].lastSoldPriceCents?.amount === 0
                      }
                      className="px-4 py-2 rounded-full bg-white text-black border border-neutral-700 mt-8"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ) : (
                'Please Choose Your Size.'
              )}
            </div>
          </div>
        </div>

        {/* Product Details Table */}
        <div className="w-full bg-neutral-800 border border-neutral-700 mt-8 p-8 rounded-2xl font-semibold">
          <div className="grid grid-cols-2 gap-4 text-white">
            <div>
              <p className="text-neutral-400">Brand</p>
              <p>{product.brandName}</p>
            </div>
            <div>
              <p className="text-neutral-400">Color</p>
              <p>{product.color}</p>
            </div>
            <div>
              <p className="text-neutral-400">Details</p>
              <p>{product.details}</p>
            </div>
            <div>
              <p className="text-neutral-400">Gender</p>
              <p>{product.gender[0]}</p>
            </div>
            <div>
              <p className="text-neutral-400">Midsole</p>
              <p>{product.midsole}</p>
            </div>
            <div>
              <p className="text-neutral-400">Release Date</p>
              <p>{product.releaseDate}</p>
            </div>
            <div>
              <p className="text-neutral-400">Upper Material</p>
              <p>{product.upperMaterial}</p>
            </div>
            <div>
              <p className="text-neutral-400">Single Gender</p>
              <p>{product.singleGender}</p>
            </div>

            <div>
              <p className="text-neutral-400">Single Gender</p>
              <p>{product.id}</p>
            </div>

            <div className="col-span-2">
              <p className="text-neutral-400">Story</p>
              <p>{product.story}</p>
            </div>
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Recommended Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array.isArray(recommendedProducts) && recommendedProducts.length > 0 ? (
              recommendedProducts.map((product) => (
                <Link href={`/product/${product.slug}`} key={product.id} passHref>
                  <div className="text-white bg-black border border-neutral-800 rounded tracking-tight relative cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:border-neutral-600 hover:scale-[1.02] h-fit">
                    <div
                      className="overflow-hidden rounded-lg relative"
                      style={{ aspectRatio: '1/1' }}
                    >
                      <Image
                        className="rounded-lg mx-auto transition-transform duration-500 hover:scale-110 object-cover"
                        src={product.mainPictureUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <div className="w-full text-xs font-bold flex items-center border-t p-4 border-neutral-700 justify-between mt-4 relative group transition-all duration-300 hover:border-neutral-700">
                      {product.name}

                      <div className="bg-neutral-800 backdrop-brightness-90 border border-neutral-700 group-hover:bg-neutral-600 py-2 px-2 rounded-full whitespace-nowrap transition-all duration-300 ease-out min-w-[90px] text-center relative">
                        <span className="block group-hover:opacity-0 transition-opacity duration-300">
                          ₮{' '}
                          {product.localizedSpecialDisplayPriceCents?.amountUsdCents === null ||
                          product.localizedSpecialDisplayPriceCents?.amountUsdCents === undefined
                            ? 'Unavailable'
                            : Math.ceil(
                                ((product.localizedSpecialDisplayPriceCents?.amountUsdCents ?? 0) *
                                  mntRate) /
                                  100,
                              ).toLocaleString()}
                        </span>
                        <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Cart
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-neutral-400">No recommended products available.</p>
            )}
          </div>
        </div>
      </div>
      <Toaster position="top-center" richColors /> {/* Add Toaster here */}
    </div>
  )
}

export default Page
