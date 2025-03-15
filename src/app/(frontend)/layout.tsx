import React from 'react'
import './styles.css'
import Navbar from '@/components/Heading/Navbar'
import { ProductProvider } from '../../app/context/ProductContext'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Saint. 2025.',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <div className="pb-20">
          <Navbar />
        </div>
        <ProductProvider>
          <main>{children}</main>
        </ProductProvider>
      </body>
    </html>
  )
}
