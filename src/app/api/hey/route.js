import { NextResponse } from 'next/server'

// Configuration
const CACHE_TTL = process.env.CACHE_TTL || 30 * 60 * 1000 // 30 minutes
const DEFAULT_RETRIES = process.env.DEFAULT_RETRIES || 3
const DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT || 10000

// Helper function to fetch with timeout and retries
const fetchWithRetry = async (
  url,
  options = {},
  retries = DEFAULT_RETRIES,
  timeout = DEFAULT_TIMEOUT,
) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        Referer: 'https://www.goat.com/',
        Origin: 'https://www.goat.com',
        'sec-fetch-site': 'same-origin',
        'sec-fetch-mode': 'cors',
        'sec-fetch-dest': 'empty',
        ...options.headers,
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText} (${response.status})`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for URL ${url}:`, error.message)

      if (i === retries - 1) throw error // Throw error if all retries fail

      console.warn(`Retrying in 2 seconds...`)
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2 seconds before retrying
    }
  }
}

// Cache mechanism to reduce API calls
const cache = new Map()

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 })
  }

  // Check cache first
  const cacheKey = `product:${slug}`
  if (cache.has(cacheKey)) {
    const cachedData = cache.get(cacheKey)
    if (Date.now() - cachedData.timestamp < CACHE_TTL) {
      console.log(`Using cached data for ${slug}`)
      return NextResponse.json(cachedData.data)
    } else {
      // Cache expired
      cache.delete(cacheKey)
    }
  }

  // Generate a realistic-looking session ID
  const sessionId = Math.random().toString(36).substring(2, 15)

  const baseUrl = 'https://www.goat.com'
  const nextDataUrl = `${baseUrl}/_next/data/ttPvG4Z_6ePho2xBcGAo6/en-us/apparel/${slug}.json?tab=new&expandedSize=101&productTemplateSlug=${slug}`

  console.log(`Fetching product data from: ${nextDataUrl}`)

  try {
    // Fetch main product data
    const data = await fetchWithRetry(
      nextDataUrl,
      {
        headers: {
          Cookie: `_session_id=${sessionId}; _goat_session=${sessionId}`,
        },
      },
      DEFAULT_RETRIES,
      DEFAULT_TIMEOUT,
    )

    // If we don't get a productTemplate, something is wrong
    if (!data.pageProps?.productTemplate?.id) {
      console.error('Invalid product data received:', data)
      return NextResponse.json({ error: 'Invalid product data structure' }, { status: 500 })
    }

    const productId = data.pageProps.productTemplate.id
    console.log(`Product ID: ${productId}`)

    // Prepare URLs for additional data
    const priceTagUrl = `${baseUrl}/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=MN`
    const recommendedUrl = `${baseUrl}/web-api/v1/product_templates/recommended?productTemplateId=${productId}&count=8`

    // Create promises for parallel requests
    const priceDataPromise = fetchWithRetry(
      priceTagUrl,
      {
        headers: {
          Cookie: `_session_id=${sessionId}; _goat_session=${sessionId}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
      DEFAULT_RETRIES,
      DEFAULT_TIMEOUT,
    ).catch((error) => {
      console.error('Price data fetch failed:', error.message)
      return { error: 'Failed to fetch price data' }
    })

    const recommendedPromise = fetchWithRetry(
      recommendedUrl,
      {
        headers: {
          Cookie: `_session_id=${sessionId}; _goat_session=${sessionId}`,
          'X-Requested-With': 'XMLHttpRequest',
        },
      },
      DEFAULT_RETRIES,
      DEFAULT_TIMEOUT,
    ).catch((error) => {
      console.error('Recommended products fetch failed:', error.message)
      return { error: 'Failed to fetch recommended products' }
    })

    // Wait for all promises to resolve
    const [priceData, recommendedProducts] = await Promise.all([
      priceDataPromise,
      recommendedPromise,
    ])

    // Create response data
    const responseData = {
      data,
      priceData: priceData?.error ? { error: priceData.error } : priceData,
      recommendedProducts: recommendedProducts?.error
        ? { error: recommendedProducts.error }
        : recommendedProducts,
      productId,
      // Only include debug info in development
      ...(process.env.NODE_ENV === 'development' && {
        debug: {
          priceTagUrl,
          recommendedUrl,
        },
      }),
    }

    // Store in cache
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now(),
    })

    return NextResponse.json(responseData)
  } catch (err) {
    console.error('Failed to fetch data from GOAT API:', err)
    return NextResponse.json(
      {
        error: `Failed to fetch data: ${err.message}`,
        slug,
      },
      { status: 500 },
    )
  }
}
