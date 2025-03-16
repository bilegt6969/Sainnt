import { NextResponse } from 'next/server'

// Enhanced helper function with better error handling and direct JSON response checking
const fetchWithRetry = async (url, options = {}, retries = 3, timeout = 15000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      // Add comprehensive browser-like headers
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

      // Log response status and headers for debugging
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
          // Try to parse as JSON anyway
          return JSON.parse(text)
        } catch (e) {
          console.error(`Response is not JSON: ${text.substring(0, 200)}...`)
          throw new Error('Response is not valid JSON')
        }
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed for ${url}:`, error.message)

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
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
      },
    })
    const html = await response.text()

    // Extract build ID from the HTML
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
      console.error('Invalid product data format:', JSON.stringify(data).substring(0, 200))
      return NextResponse.json({ error: 'Invalid product data format', data }, { status: 500 })
    }

    const productId = data.pageProps.productTemplate.id
    console.log('Product ID:', productId)

    // Fetch price data with proper error handling
    let priceData = null
    try {
      // Try multiple endpoints for price data
      const priceEndpoints = [
        `https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=US`,
        `https://www.goat.com/api/v1/product_variants/buy_bar_data?productTemplateId=${productId}&countryCode=US`,
        `https://www.goat.com/api/v1/product_variants/buy_bar_data?productTemplateId=${productId}`,
      ]

      for (const endpoint of priceEndpoints) {
        try {
          console.log('Trying price data endpoint:', endpoint)
          priceData = await fetchWithRetry(endpoint)
          if (priceData) {
            console.log('Successfully fetched price data')
            break
          }
        } catch (e) {
          console.log(`Failed with endpoint ${endpoint}, trying next...`)
        }
      }

      if (!priceData) {
        throw new Error('All price endpoints failed')
      }
    } catch (priceError) {
      console.error('Failed to fetch price data:', priceError)
      priceData = { error: 'Failed to fetch price data: ' + priceError.message }
    }

    // Fetch recommended products with proper error handling
    let recommendedProducts = []
    try {
      // Try multiple endpoints for recommended products
      const recommendedEndpoints = [
        `https://www.goat.com/web-api/v1/product_templates/recommended?productTemplateId=${productId}&count=8`,
        `https://www.goat.com/api/v1/product_templates/recommended?productTemplateId=${productId}&count=8`,
        `https://www.goat.com/web-api/v1/product_templates/${productId}/similar?count=8`,
      ]

      for (const endpoint of recommendedEndpoints) {
        try {
          console.log('Trying recommended products endpoint:', endpoint)
          const recommendedResponse = await fetchWithRetry(endpoint)
          if (recommendedResponse && recommendedResponse.productTemplates) {
            recommendedProducts = recommendedResponse.productTemplates
            console.log('Successfully fetched recommended products')
            break
          }
        } catch (e) {
          console.log(`Failed with endpoint ${endpoint}, trying next...`)
        }
      }

      if (recommendedProducts.length === 0) {
        throw new Error('All recommended product endpoints failed')
      }
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
