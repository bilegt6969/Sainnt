'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/functions'
import { useClickOutside } from '@/hooks'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box,
  CalendarClock,
  Captions,
  CircleHelp,
  CopyCheck,
  FileText,
  Gem,
  Layers3,
  LineChart,
  Newspaper,
  UserCog,
  Waypoints,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface Props {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  authButton?: React.ReactNode // Optional authButton prop for smaller screens
}

const MobileMenu = ({ isOpen, setIsOpen, authButton }: Props) => {
  const ref = useClickOutside(() => setIsOpen(false))

  const variants = {
    open: { opacity: 1, y: 20 },
    closed: { opacity: 0, y: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={ref}
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          transition={{
            type: 'spring',
            bounce: 0.15,
            duration: 0.5,
          }}
          className={cn(
            'absolute top-12 inset-x-0 size-full p-4 z-20 bg-inherit flex flex-1',
            isOpen ? 'flex' : 'hidden',
          )}
        >
          <motion.div
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            variants={variants}
            transition={{
              type: 'spring',
              bounce: 0.15,
              duration: 0.5,
            }}
            className="size-full flex flex-col justify-start"
          >
            <div className="border border-neutral-700 bg-neutral-800 rounded-2xl backdrop-blur-lg">
              {/* Render authButton at the top if provided */}
              {authButton && <div className="w-full px-4 py-2 mb-1">{authButton}</div>}
            </div>

            <ul className="flex flex-col items-start flex-1 w-full space-y-3">
              {/* How It Works */}
              <li
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80"
              >
                <Link href="/how-it-works" className="flex items-center w-full text-start">
                  <UserCog className="w-4 h-4 mr-2" />
                  How it works
                </Link>
              </li>

              {/* Features Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-transparent">
                  <AccordionTrigger className="px-4 py-2 text-lg hover:text-muted-foreground font-normal">
                    <span className="flex items-center">
                      <CopyCheck className="w-4 h-4 mr-2" />
                      Features
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-start gap-1 mt-1"
                  >
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <Captions className="w-4 h-4 mr-2" />
                        Caption Generation
                      </Link>
                    </li>
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <CalendarClock className="w-4 h-4 mr-2" />
                        Post Scheduling
                      </Link>
                    </li>
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <LineChart className="w-4 h-4 mr-2" />
                        Analytics Dashboard
                      </Link>
                    </li>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Pricing */}
              <li
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80"
              >
                <Link href="/" className="flex items-center w-full text-start">
                  <Gem className="w-4 h-4 mr-2" />
                  Pricing
                </Link>
              </li>

              {/* Integrations */}
              <li
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-lg hover:text-muted-foreground font-normal transition transform rounded-md cursor-pointer text-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80"
              >
                <Link href="/" className="flex items-center w-full text-start">
                  <Waypoints className="w-4 h-4 mr-2" />
                  Integrations
                </Link>
              </li>

              {/* Resources Accordion */}
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-2" className="border-transparent">
                  <AccordionTrigger className="px-4 py-2 text-lg hover:text-muted-foreground font-normal">
                    <span className="flex items-center">
                      <Layers3 className="w-4 h-4 mr-2" />
                      Resources
                    </span>
                  </AccordionTrigger>
                  <AccordionContent
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-start gap-1 mt-1"
                  >
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <Newspaper className="w-4 h-4 mr-2" />
                        Blog
                      </Link>
                    </li>
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <FileText className="w-4 h-4 mr-2" />
                        Case Studies
                      </Link>
                    </li>
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <Box className="w-4 h-4 mr-2" />
                        Tools
                      </Link>
                    </li>
                    <li className="w-full px-4 py-2 text-lg font-normal transition transform rounded-md cursor-pointer text-foreground/80 hover:text-muted-foreground text-start active:scale-95 hover:bg-muted/20 active:opacity-80">
                      <Link href="/" className="flex items-center w-full text-start">
                        <CircleHelp className="w-4 h-4 mr-2" />
                        Support
                      </Link>
                    </li>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MobileMenu
