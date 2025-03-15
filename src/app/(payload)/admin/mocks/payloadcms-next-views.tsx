// mocks/payloadcms-next-views.ts
import type { Metadata } from 'next'

// Mock implementation of NotFoundPage
export const NotFoundPage = ({
  config,
  params,
  searchParams,
  importMap,
}: {
  config: any
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
  importMap: any
}) => (
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
)

// Mock implementation of generatePageMetadata
export const generatePageMetadata = ({
  config,
  params,
  searchParams,
}: {
  config: any
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
}): Metadata => ({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
})
