'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { Avatar } from '@heroui/react'
import { ArrowRightIcon } from 'lucide-react'
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

const AuthButton = () => {
  const [user, setUser] = useState<User | null>(null) // Use the User type from Firebase
  const router = useRouter()

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
    router.push('/login')
  }

  return (
    <div className="flex items-center text-black">
      {user ? (
        <div className="flex items-center space-x-0">
          <Dropdown>
            <DropdownTrigger>
              <div>
                <Avatar
                  showFallback
                  className="bg-[#232323] border border-neutral-700 h-8 w-8"
                  src={user.photoURL || undefined} // Convert null to undefined
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User Actions">
              <DropdownItem key="sign-out">
                <Button size="sm" color="danger" onClick={handleSignOut}>
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
        <div className="">
          <Button
            size="sm"
            variant="default" // or any other valid variant
            className="hover:translate-y-[1px] hover:scale-100 rounded-full border bg-white border-neutral-700"
            onClick={handleSignIn}
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
