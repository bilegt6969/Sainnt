// file: src/app/(frontend)/brands/[brand]/page.tsx
// Server component (no 'use client' directive)

import BrandPageWrapper from './BrandPageWrapper'

// Define the page component with the correct Next.js types
export default async function Page({ params }: { params: { brand: string } }) {
  // If you need to fetch data, you can do it here
  // const brandData = await fetchBrandData(params.brand);

  return <BrandPageWrapper brand={params.brand} />
}
