'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import the client component with no SSR
// This is now in a client component, so ssr: false is allowed
const BrandPageClient = dynamic(() => import('./Client'), { ssr: false })

export default function BrandPageWrapper({ brand, brandData }: { brand: string; brandData?: any }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrandPageClient brand={brand} brandData={brandData} />
    </Suspense>
  )
}
