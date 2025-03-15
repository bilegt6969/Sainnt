'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
} from '../../../../firebaseConfig'
import { Input } from '../../../../components/ui/input'
import { Button } from '../../../../components/ui/button'
import { Label } from '../../../../components/ui/label'
import { SocialIcon } from 'react-social-icons' // Import the SocialIcon component
import Logo from '../../../../../public/images/Saint.svg'
import Image from 'next/image'

const SignUpPage = () => {
  const [email, setEmail] = useState('')
  const [UserName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [phone, setPhone] = useState('')

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert('Account created successfully!')
    } catch (error) {
      if (error instanceof Error) {
        setError('Error creating account: ' + error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      alert('Logged in with Google!')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  const handleFacebookSignIn = async () => {
    const provider = new FacebookAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      alert('Logged in with Facebook!')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  const handleAppleSignIn = async () => {
    const provider = new OAuthProvider('apple.com')
    try {
      await signInWithPopup(auth, provider)
      alert('Logged in with Apple!')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  const handlePhoneSignIn = async () => {
    const appVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
    })

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier)
      window.confirmationResult = confirmationResult
      alert('Verification code sent to phone!')
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden p-4 pt-20">
      <div className="w-1/2 bg-black border border-neutral-700 rounded-2xl p-8 flex flex-col justify-center items-center text-left text-white">
        <Image src={Logo} alt="Login Illustration" width={250} height={250} className="mb-6" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="min-h-screen flex items-center justify-center w-full ">
          <div className="bg-black border border-neutral-700 p-8 rounded-xl shadow-lg w-full max-w-xl">
            <h2 className="text-3xl font-bold text-start  text-white mb-6">Create an Account</h2>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-700 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <Label htmlFor="email">UserName</Label>
                <Input
                  id="UserName"
                  type="UserName"
                  placeholder="User name"
                  value={UserName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-700 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="w-full px-4 py-2 border border-neutral-700 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Confirm Password Input */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-700 bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm">{error}</p>}

              {/* SignUp Button */}
              <Button
                onClick={handleSignUp}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Sign Up
              </Button>

              {/* Social Sign-in Buttons */}
              <div className="space-y-2 mt-4">
                <Button
                  onClick={handleGoogleSignIn}
                  className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <SocialIcon url="https://google.com" className="h-5 w-5 mr-2" /> Continue with
                  Google
                </Button>
                <Button
                  onClick={handleFacebookSignIn}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <SocialIcon url="https://facebook.com" className="h-5 w-5 mr-2" /> Continue with
                  Facebook
                </Button>
                <Button
                  onClick={handleAppleSignIn}
                  className="w-full bg-black text-white py-2 rounded-lg flex items-center justify-center"
                >
                  <SocialIcon url="https://apple.com" className="h-5 w-5 mr-2" /> Continue with
                  Apple
                </Button>
              </div>

              {/* Phone Number Sign-Up */}
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                />
                <Button
                  onClick={handlePhoneSignIn}
                  className="w-full bg-green-500 text-white py-2 rounded-lg mt-2"
                >
                  Sign Up with Phone
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
