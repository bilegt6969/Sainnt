import { NextResponse } from 'next/server'

// Enhanced helper function with better error handling, headers, and exponential backoff
const fetchWithRetry = async (url, options = {}, retries = 3, timeout = 15000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      // Add default browser-like headers if not provided
      const headers = {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        Referer: 'https://www.goat.com/',
        Origin: 'https://www.goat.com',
        Accept: 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        ...(options.headers || {}),
      }

      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
        credentials: 'omit', // Avoid sending cookies
      })
      clearTimeout(timeoutId)

      // Log response status for debugging
      console.log(`Fetch status for ${url}: ${response.status}`)

      if (!response.ok) {
        let responseText = ''
        try {
          responseText = await response.text()
          console.error(`Error response body: ${responseText.substring(0, 200)}...`)
        } catch (e) {
          console.error('Could not read response body')
        }
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error.message)

      // Check if it's the last retry
      if (i === retries - 1) throw error

      // Exponential backoff
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
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })
    const html = await response.text()

    // Extract build ID from the HTML
    const buildIdMatch = html.match(/"buildId":"([^"]+)"/)
    if (buildIdMatch && buildIdMatch[1]) {
      return buildIdMatch[1]
    }

    // Fallback to the hardcoded value if extraction fails
    console.warn('Could not extract build ID, using fallback')
    return 'ttPvG4Z_6ePho2xBcGAo6'
  } catch (error) {
    console.error('Failed to fetch build ID:', error)
    return 'ttPvG4Z_6ePho2xBcGAo6' // Fallback to hardcoded value
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

    // Verify product data and extract ID
    if (!data?.pageProps?.productTemplate?.id) {
      return NextResponse.json({ error: 'Invalid product data format' }, { status: 500 })
    }

    const productId = data.pageProps.productTemplate.id
    console.log('Product ID:', productId)

    // Fetch price data with proper error handling
    let priceData = null
    try {
      const priceTagUrl = `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=US`
      console.log('Fetching price data from:', priceTagUrl)
      priceData = await fetchWithRetry(priceTagUrl)
    } catch (priceError) {
      console.error('Failed to fetch price data:', priceError)
      priceData = { error: 'Failed to fetch price data: ' + priceError.message }
    }

    // Fetch recommended products with proper error handling
    let recommendedProducts = []
    try {
      const recommendedUrl = `https://www.goat.com/web-api/v1/product_templates/recommended?productTemplateId=${productId}&count=8`
      console.log('Fetching recommended products from:', recommendedUrl)
      const recommendedResponse = await fetchWithRetry(recommendedUrl)
      recommendedProducts = recommendedResponse.productTemplates || []
    } catch (recommendedError) {
      console.error('Failed to fetch recommended products:', recommendedError)
      recommendedProducts = {
        error: 'Failed to fetch recommended products: ' + recommendedError.message,
      }
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
