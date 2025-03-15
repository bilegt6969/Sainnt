'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './Navbar/navigation-menu'
import { CalendarRangeIcon, CircleHelp, HashIcon, Newspaper, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import Icons from '../global/icons'
import { motion } from 'framer-motion'

const Menu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground hover:text-foreground w-max hover:bg-none">
              For You
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        {/* Categories Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground">
            Categories
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid rounded-3xl gap-3 p-4 md:w-[400px] lg:w-[500px] xl:w-[550px] lg:grid-cols-[.75fr_1fr]"
            >
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="flex flex-col justify-end w-full h-full p-4 no-underline rounded-lg outline-none select-none bg-gradient-to-tr from-accent to-accent/50 focus:shadow-md"
                  >
                    <Icons.icon className="w-6 h-6" />
                    <div className="my-2 text-lg font-normal">Shop All</div>
                    <p className="text-sm text-muted-foreground">
                      Explore all categories and collections.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <Item
                title="Sneakers"
                href="/categories/sneakers"
                icon={<HashIcon className="w-5 h-5" />}
              >
                Discover the latest sneaker drops.
              </Item>
              <Item
                title="Apparel"
                href="/categories/apparel"
                icon={<UsersIcon className="w-5 h-5" />}
              >
                Shop trendy apparel and streetwear.
              </Item>
              <Item
                title="Accessories"
                href="/categories/accessories"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Complete your look with accessories.
              </Item>
            </motion.ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Brands Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground">
            Brands
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid rounded-3xl gap-3 p-4 md:w-[400px] lg:w-[500px] xl:w-[550px] lg:grid-cols-[.75fr_1fr]"
            >
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link
                    href="/"
                    className="flex flex-col justify-end w-full h-full p-4 no-underline rounded-lg outline-none select-none bg-gradient-to-tr from-accent to-accent/50 focus:shadow-md"
                  >
                    <Icons.icon className="w-6 h-6" />
                    <div className="my-2 text-lg font-normal">Shop by Brand</div>
                    <p className="text-sm text-muted-foreground">
                      Explore top brands and collections.
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <Item title="Nike" href="/brands/nike" icon={<HashIcon className="w-5 h-5" />}>
                Shop the latest Nike sneakers and apparel.
              </Item>
              <Item title="Stüssy" href="/brands/stussy" icon={<UsersIcon className="w-5 h-5" />}>
                Discover Stüssy&apos;s iconic streetwear.
              </Item>
              <Item
                title="Bape"
                href="/brands/bape"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Explore Bape&apos;s unique designs.
              </Item>
              <Item
                title="Vlone"
                href="/brands/vlone"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Shop Vlone&apos;s exclusive collections.
              </Item>
              <Item
                title="Air Jordan"
                href="/brands/air-jordan"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Shop Air Jordan&apos;s iconic sneakers.
              </Item>
              <Item
                title="Supreme"
                href="/brands/supreme"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Explore Supreme&apos;s streetwear collections.
              </Item>
              <Item
                title="Gucci"
                href="/brands/gucci"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Discover Gucci&apos;s luxury fashion.
              </Item>
              <Item
                title="Adidas"
                href="/brands/adidas"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Find Adidas sneakers and apparel.
              </Item>
              <Item
                title="New Balance"
                href="/brands/new-balance"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Shop New Balance&apos;s classic styles.
              </Item>
              <Item
                title="Puma"
                href="/brands/puma"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Explore Puma&apos;s sportswear and sneakers.
              </Item>
              <Item
                title="Off-White"
                href="/brands/off-white"
                icon={<CalendarRangeIcon className="w-5 h-5" />}
              >
                Shop Off-White&apos;s modern designs.
              </Item>
            </motion.ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Resources Section */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground">
            Resources
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <motion.ul
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid w-[400px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[500px] xl:w-[500px]"
            >
              <Item title="Blog" href="/resources/blog" icon={<Newspaper className="w-5 h-5" />}>
                Read our latest articles and updates.
              </Item>
              <Item
                title="Support"
                href="/resources/support"
                icon={<CircleHelp className="w-5 h-5" />}
              >
                Get help with any issues you may have.
              </Item>
            </motion.ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Help Section */}
        <NavigationMenuItem>
          <Link href="/integrations" legacyBehavior passHref>
            <NavigationMenuLink className="h-10 px-4 py-2 text-sm font-normal rounded-md text-muted-foreground hover:text-foreground w-max hover:bg-none">
              Help
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

// Reusable Item Component
const Item = ({ title, href, children, icon, ...props }: Props) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          passHref
          href={href}
          {...props}
          className="grid grid-cols-[.15fr_1fr] select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group"
        >
          <div className="flex items-center mt-1 justify-center p-1 w-8 h-8 rounded-md border border-border/80">
            {icon}
          </div>
          <div className="text-start ml-3">
            <span className="text-sm group-hover:text-foreground font-normal leading-none">
              {title}
            </span>
            <p className="text-sm mt-0.5 line-clamp-2 text-muted-foreground">{children}</p>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

Item.displayName = 'Item'

export default Menu
