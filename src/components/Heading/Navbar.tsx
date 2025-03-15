'use client'

import { cn } from '@/functions'
import { ArrowRightIcon, XIcon, Search, ChevronRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'
import Icons from '../global/icons'
import Wrapper from '../global/wrapper'
import { Button } from '../ui/button'
import Menu from './menu'
import MobileMenu from './mobile-menu'
import Logo from '../../../public/images/Logo.svg'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AuthButton from '../../app/(frontend)/(auth)/AuthButton'
import { PlaceholdersAndVanishInput } from '../ui/placeholders-and-vanish-input'
import useCartStore from '../../app/store/cartStore'
import { useMediaQuery } from '@/hooks/use-media-query' // Custom hook for media queries

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen1, setIsOpen1] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const isLargeScreen = useMediaQuery('(min-width: 1024px)') // Check if screen is large

  const cart = useCartStore((state) => state.cart)
  const itemCount = cart.reduce(
    (total: number, item: { quantity: number }) => total + item.quantity,
    0,
  )

  // Fetch search suggestions from the server-side API
  const fetchSearchSuggestions = async () => {
    try {
      const response = await fetch('/api/search-suggestions')
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setSearchSuggestions(data.suggestions)
    } catch (error) {
      console.error('Failed to fetch search suggestions:', error)
      setSearchSuggestions(['Saint', 'bytecode Studio', 'Spike Cards'])
    }
  }

  // Load recent searches from localStorage
  useEffect(() => {
    const storedSearches = localStorage.getItem('recentSearches')
    if (storedSearches) {
      setRecentSearches(JSON.parse(storedSearches))
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = (query: string) => {
    const updatedSearches = [query, ...recentSearches.filter((item) => item !== query)].slice(0, 5)
    setRecentSearches(updatedSearches)
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches))
  }

  useEffect(() => {
    if (isOpen1) {
      fetchSearchSuggestions()
      inputRef.current?.focus()
    }
  }, [isOpen1])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery.trim())
      router.push(`/search?query=${searchQuery.trim()}`)
      setIsOpen1(false)
    }
  }

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen1 && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsOpen1(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen1])

  return (
    <div className="relative w-full h-full text-neutral-400">
      <div className="z-[99] fixed pointer-events-none inset-x-0 h-[88px] bg-[rgba(31,31,31,0.82)] backdrop-blur-sm [mask:linear-gradient(to_bottom,#000_20%,transparent_calc(100%-20%))]"></div>

      <header
        className={cn(
          'fixed top-4 inset-x-0 mx-auto max-w-6xl px-2 md:px-12 z-[100] transform',
          isOpen ? 'h-[calc(100%-24px)]' : 'h-12',
        )}
      >
        <Wrapper className="backdrop-blur-lg backdrop-brightness-60 rounded-xl lg:rounded-3xl border border-[rgba(124,124,124,0.2)] px- md:px-2 flex items-center justify-start">
          <div className="flex items-center justify-between w-full sticky mt-[7px] lg:mt-auto mb-auto inset-x-0">
            <div className="flex items-center flex-1 lg:flex-none pl-0">
              <Link
                href="/"
                className="text-lg font-semibold transition-colors text-foreground bg-[#232323] hover:bg-neutral-900 py-0 px-[5px] rounded-full border border-neutral-700 flex items-center"
              >
                <Image
                  height={60}
                  width={60}
                  src={Logo}
                  alt="Saint Logo"
                  priority
                  className="transition-transform duration-300 transform px-1"
                />
              </Link>
              <div className="items-center hidden ml-4 lg:flex">
                <Menu />
              </div>
            </div>

            <div className="items-center flex gap-2 lg:gap-4">
              <Button
                size="sm"
                variant="tertiary"
                onClick={() => setIsOpen1(true)}
                className="hover:translate-y-[1px] hover:scale-100 rounded-full text-white border border-neutral-700"
              >
                <Search className="w-4 h-4 " />
                <span className="hidden lg:block ml-1">Search</span>
              </Button>

              <Link
                href="/bag"
                className="relative flex items-center hover:translate-y-[1px] duration-300 transition-all ease-soft-spring"
              >
                <ShoppingBag className="w-6 h-6 text-neutral-500 ml-1" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                    {itemCount}
                  </span>
                )}
              </Link>

              {/* Render AuthButton in navbar for large screens */}
              {isLargeScreen && (
                <div className="hover:translate-y-[1px] duration-300 transition-all ease-soft-spring">
                  <AuthButton />
                </div>
              )}

              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen((prev) => !prev)}
                className="lg:hidden p-2 w-8 h-8"
              >
                {isOpen ? (
                  <XIcon className="w-4 h-4 duration-300" />
                ) : (
                  <Icons.menu className="w-3.5 h-3.5 duration-300" />
                )}
              </Button>
            </div>
          </div>
          {/* Pass AuthButton to MobileMenu for small screens */}
          <MobileMenu
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            authButton={!isLargeScreen && <AuthButton />}
          />
        </Wrapper>
      </header>

      <AnimatePresence>
        {isOpen1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen1(false)
              }
            }}
          >
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="backdrop-brightness-80 backdrop-blur-2xl border border-neutral-700 rounded-3xl w-[500px] p-6 shadow-2xl relative"
            >
              <PlaceholdersAndVanishInput
                placeholders={searchSuggestions}
                onChange={handleChange}
                onSubmit={onSubmit}
                ref={inputRef}
              />

              <div className="mt-6 text-neutral-400">
                <h3 className="text-sm text-neutral-500 mb-2">Recent Searches</h3>
                {recentSearches.length ? (
                  <ul className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <li
                        key={index}
                        className="cursor-pointer hover:text-white transition-all duration-200 flex items-center"
                        onClick={() => {
                          setSearchQuery(search)
                          inputRef.current?.focus()
                          onSubmit({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>)
                        }}
                      >
                        <ChevronRight className="w-4 h-4 text-neutral-500 mr-2" /> {search}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center">No recent searches</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Navbar
