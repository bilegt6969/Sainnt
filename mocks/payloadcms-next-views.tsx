// mocks/payloadcms-next-views.ts
import type { Metadata } from 'next'
import type { ReactElement } from 'react'

// Mock implementation of RootPage
export const RootPage = ({
  config,
  params,
  searchParams,
  importMap,
}: {
  config: any
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
  importMap: any
}): ReactElement => (
  <div>
    <h1>Root Page</h1>
    <p>This is a mock implementation of the RootPage component.</p>
  </div>
)

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
}): ReactElement => (
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
)

// Mock implementation of generatePageMetadata
export const generatePageMetadata = async ({
  config,
  params,
  searchParams,
}: {
  config: any
  params: { segments: string[] }
  searchParams: { [key: string]: string | string[] }
}): Promise<Metadata> => ({
  title: 'Page Not Found',
  description: 'The page you are looking for does not exist.',
})
