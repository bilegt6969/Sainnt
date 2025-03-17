import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export async function GET() {
  const url =
    'https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId=1273697&countryCode=MN'

  try {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    // Set a realistic User-Agent
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    )

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle2' })

    // Extract the JSON response
    const data = await page.evaluate(() => {
      return JSON.parse(document.body.innerText)
    })

    await browser.close()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 },
    )
  }
}
