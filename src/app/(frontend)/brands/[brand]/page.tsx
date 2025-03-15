// file: src/app/(frontend)/brands/[brand]/page.tsx
// Server component (no 'use client' directive)

import BrandPageWrapper from './BrandPageWrapper'

// Define the page component with the correct Next.js types
export default function Page({ params }: { params: { brand: string } }) {
  return <BrandPageWrapper brand={params.brand} />
}
