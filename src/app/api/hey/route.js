import { NextResponse } from 'next/server'

// Helper function to fetch with timeout and retries
const fetchWithRetry = async (url, options = {}, retries = 3, timeout = 15000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      // Use browser-like headers
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        Referer: 'https://www.goat.com/',
        Origin: 'https://www.goat.com',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'sec-ch-ua': '"Google Chrome";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        ...(options.headers || {}),
      }

      console.log(`Fetching ${url} with retry ${i + 1}/${retries}`)

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'omit',
      })
      clearTimeout(timeoutId)

      console.log(`Response status for ${url}: ${response.status}`)

      if (!response.ok) {
        let errorBody = ''
        try {
          errorBody = await response.text()
          console.error(`Error response body (${url}): ${errorBody.substring(0, 200)}...`)
        } catch (e) {
          console.error('Could not read error response body')
        }
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      } else {
        const text = await response.text()
        try {
          return JSON.parse(text)
        } catch (e) {
          console.error(`Response is not JSON: ${text.substring(0, 200)}...`)
          throw new Error('Response is not valid JSON')
        }
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error.message)

      if (i === retries - 1) throw error

      const delay = 2000 * Math.pow(2, i)
      console.log(`Waiting ${delay}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

// Fetch the current build ID from GOAT's website
const fetchBuildId = async () => {
  try {
    const response = await fetch('https://www.goat.com/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
    })
    const html = await response.text()

    const buildIdMatch = html.match(/"buildId":"([^"]+)"/)
    if (buildIdMatch && buildIdMatch[1]) {
      console.log('Found build ID:', buildIdMatch[1])
      return buildIdMatch[1]
    }

    console.warn('Could not extract build ID, using fallback')
    return 'ttPvG4Z_6ePho2xBcGAo6'
  } catch (error) {
    console.error('Failed to fetch build ID:', error)
    return 'ttPvG4Z_6ePho2xBcGAo6'
  }
}

// Function to extract price data directly from the product data
const extractPriceData = (productData) => {
  try {
    if (!productData?.pageProps?.productTemplate) {
      return null
    }

    const product = productData.pageProps.productTemplate
    const variants = product.productVariants || []

    // Extract price information from the product data
    let priceData = {
      lowestPrice: null,
      sizes: [],
    }

    variants.forEach((variant) => {
      if (variant.size && variant.lowestPriceOption) {
        const price = variant.lowestPriceOption.price

        // Track the lowest price
        if (priceData.lowestPrice === null || price < priceData.lowestPrice) {
          priceData.lowestPrice = price
        }

        // Add size information
        priceData.sizes.push({
          size: variant.size,
          price: price,
          inStock: variant.stockStatus === 'in_stock',
        })
      }
    })

    return priceData
  } catch (error) {
    console.error('Error extracting price data:', error)
    return null
  }
}

// Function to extract recommended products from the product data
const extractRecommendedProducts = (productData) => {
  try {
    const relatedProducts = productData?.pageProps?.productTemplate?.relatedProductTemplates || []

    // Map related products to a simplified format
    return relatedProducts.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand,
      imageUrl: product.mainPictureUrl,
      price: product.retailPrice,
    }))
  } catch (error) {
    console.error('Error extracting recommended products:', error)
    return []
  }
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 })
  }

  try {
    // Get the current build ID
    const buildId = await fetchBuildId()

    // Construct the URL with the current build ID
    const url = `https://www.goat.com/_next/data/${buildId}/en-us/apparel/${slug}.json?tab=new&expandedSize=101&productTemplateSlug=${slug}`

    // Fetch main product data
    console.log('Fetching product data from:', url)
    const data = await fetchWithRetry(url)

    // Verify product data
    if (!data?.pageProps?.productTemplate?.id) {
      console.error('Invalid product data format:', JSON.stringify(data).substring(0, 200))
      return NextResponse.json({ error: 'Invalid product data format', data }, { status: 500 })
    }

    const productId = data.pageProps.productTemplate.id
    console.log('Product ID:', productId)

    // Extract price data from the product data instead of making an API call
    const priceData = extractPriceData(data) || { error: 'Could not extract price data' }

    // Try to fetch recommended products from the API
    let recommendedProducts = []
    try {
      const recommendedUrl = `https://www.goat.com/api/v1/product_templates/recommended?productTemplateId=${productId}&count=8`
      console.log('Fetching recommended products from:', recommendedUrl)
      const recommendedResponse = await fetchWithRetry(recommendedUrl)

      if (recommendedResponse && recommendedResponse.productTemplates) {
        recommendedProducts = recommendedResponse.productTemplates
        console.log('Successfully fetched recommended products')
      } else {
        // Extract recommended products from the main product data as a fallback
        recommendedProducts = extractRecommendedProducts(data)
        console.log('Using extracted recommended products')
      }
    } catch (error) {
      console.error('Failed to fetch recommended products:', error)
      // Extract recommended products from the main product data as a fallback
      recommendedProducts = extractRecommendedProducts(data)
      console.log('Using extracted recommended products after error')
    }

    // Return combined response
    return NextResponse.json({
      data,
      priceData,
      recommendedProducts,
    })
  } catch (err) {
    console.error('Failed to fetch data:', err)
    return NextResponse.json(
      {
        error: `Failed to fetch data: ${err.message}`,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      },
      { status: 500 },
    )
  }
}
