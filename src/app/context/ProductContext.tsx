'use client'
// context/ProductContext.tsx
import React, { createContext, useContext, useState } from 'react'

interface ProductContextType {
  setPageData: (data: any) => void
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
  const [pageData, setPageData] = useState<any>(null)

  return <ProductContext.Provider value={{ setPageData }}>{children}</ProductContext.Provider>
}
