'use client'

import React, { createContext, useContext, useState } from 'react'

// Define a type for the page data
interface PageData {
  // Add the properties you expect in pageData
  id?: string
  name?: string
  price?: number
  // Add more properties as needed
}

interface ProductContextType {
  setPageData: (data: PageData | null) => void // Replace `any` with `PageData`
}

const ProductContext = createContext<ProductContextType | null>(null)

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider')
  }
  return context
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [_pageData, setPageData] = useState<PageData | null>(null) // Prefix unused variable with underscore

  return <ProductContext.Provider value={{ setPageData }}>{children}</ProductContext.Provider>
}
