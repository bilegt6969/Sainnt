'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { Avatar } from '@heroui/react'
import { ArrowRightIcon } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

const AuthButton = () => {
  const [user, setUser] = useState<any>(null) // You can specify 'any' or use a specific type for 'user'
  const router = useRouter() // Hook to handle routing

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    return () => unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await signOut(auth)
  }

  const handleSignIn = () => {
    // Redirect to the sign-in page
    router.push('/login')
  }

  return (
    <div className="flex items-center text-black">
      {/* Only render the dropdown if the user is logged in */}
      {user ? (
        <div className="flex items-center space-x-0">
          <Dropdown>
            <DropdownTrigger>
              <div>
                <Avatar
                  showFallback
                  className="bg-[#232323] border border-neutral-700 h-8 w-8 "
                  src={user.photoURL}
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="sign-out">
                <Button size="sm" color="danger" auto onClick={handleSignOut}>
                  Sign Out
                </Button>
              </DropdownItem>
              <DropdownItem key="copy-link">Copy link</DropdownItem>
              <DropdownItem key="edit">Edit profile</DropdownItem>
              <DropdownItem key="delete" color="danger">
                Delete account
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : (
        // Render Sign In button when no user is logged in
        <div className="">
          <Button
            size="sm"
            variant="shadow"
            className="hover:translate-y-[1px] hover:scale-100 rounded-full border bg-white border-neutral-700"
            onClick={handleSignIn} // Call sign-in function on button click
          >
            Sign In
            <ArrowRightIcon className="w-4 h-4 ml-1 hidden lg:block" />
          </Button>
        </div>
      )}
    </div>
  )
}

export default AuthButton
