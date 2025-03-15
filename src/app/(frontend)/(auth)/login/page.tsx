'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../../firebaseConfig'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { Label } from '../../../../components/ui/label'
import Logo from '../../../../../public/images/Saint.svg'
import Image from 'next/image'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('') // Clear previous errors
    try {
      await signInWithEmailAndPassword(auth, email, password)
      alert('Logged in successfully!')
    } catch (error: any) {
      console.error('Login failed:', error)
      setError('Login failed. Please check your credentials and try again.')
    }
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden pt-20 p-4">
      {/* Left Side (Image) */}
      <div className="w-1/2 bg-black border border-neutral-700 rounded-2xl p-8 flex flex-col justify-center items-center text-left text-white">
        <Image src={Logo} alt="Login Illustration" width={250} height={250} className="mb-6" />
        <h1 className="text-3xl font-bold text-center mb-4"></h1>
        <p className="text-lg text-gray-300 text-center max-w-md font-semibold">
          ᠦᠨᠡᠢᠨ ᠰᠠᠯᠬᠢ ᠲᠣᠭᠲᠤᠬᠦᠢ᠃
          <br />
          ᠦᠨᠡᠨ ᠦᠨᠡ ᠦᠪᠡᠷ ᠶᠡ ᠢᠯᠲᠦᠭᠡᠬᠦᠢ᠃
          <br />
          ᠠᠷᠢᠯᠵᠠᠭᠠᠨ ᠬᠦᠷᠮᠠᠭ ᠦᠭᠡᠢ ᠪᠣᠯᠭᠠᠵᠤᠯᠲᠤ᠃
          <br />
          ᠠᠷᠳᠤ ᠲᠥᠮᠡᠨ ᠡᠷᠬᠡ ᠴᠢᠯᠦᠭᠡᠲᠦᠢ!
        </p>
      </div>

      {/* Right Side (Login Form) */}
      <div className="w-1/2 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-neutral-700">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          <div className="space-y-6">
            {/* Email Input */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                className="w-full"
              />
            </div>
            {/* Password Input */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-label="Password"
                className="w-full"
              />
            </div>
            {/* Login Button */}
            <Button
              onClick={handleLogin}
              className="w-full bg-neutral-800 text-white py-2 rounded-lg hover:bg-neutral-900 transition duration-300"
            >
              Login
            </Button>
          </div>
          {/* Sign-Up Link */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/auth/signup" className="text-neutral-900 underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
