'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import {
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithPhoneNumber,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@/firebaseConfig'
import { FirebaseError } from 'firebase/app' // Import FirebaseError for better error handling
import { ConfirmationResult } from 'firebase/auth' // Import ConfirmationResult from Firebase Auth

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

declare global {
  interface Window {
    confirmationResult?: ConfirmationResult // Use ConfirmationResult type
  }
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password)
        alert('Account created successfully!')
      } else {
        await signInWithEmailAndPassword(auth, email, password)
        alert('Logged in successfully!')
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message) // Cast error as FirebaseError for better error handling
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
      if (error instanceof FirebaseError) {
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
      if (error instanceof FirebaseError) {
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
      if (error instanceof FirebaseError) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  const handlePhoneSignIn = async () => {
    const appVerifier = new RecaptchaVerifier('recaptcha-container', { size: 'invisible' }, auth)
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier)
      window.confirmationResult = confirmationResult // Store confirmation result on window object
      alert('Verification code sent to phone!')
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message)
      } else {
        setError('An unknown error occurred.')
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-neutral-900 text-white border border-neutral-700 rounded-3xl w-[400px] p-6 shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-400">
          <XIcon className="w-5 h-5" />
        </button>
        <h2 className="text-2xl font-semibold text-center mb-4">
          {isSignUp ? 'Create an Account' : 'Welcome Back'}
        </h2>
        <div className="space-y-4">
          {isSignUp ? (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
            </>
          ) : (
            <>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
              />
            </>
          )}
          {error && <p className="text-red-500 text-center">{error}</p>}
          <Button className="w-full" onClick={handleAuth}>
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <Button className="w-full" onClick={handleGoogleSignIn}>
            Sign In with Google
          </Button>
          <Button className="w-full" onClick={handleFacebookSignIn}>
            Sign In with Facebook
          </Button>
          <Button className="w-full" onClick={handleAppleSignIn}>
            Sign In with Apple
          </Button>
          <div id="recaptcha-container"></div>
          <input
            type="text"
            placeholder="Phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 rounded-lg bg-neutral-800 border border-neutral-700 text-white"
          />
          <Button className="w-full" onClick={handlePhoneSignIn}>
            Sign In with Phone
          </Button>
        </div>
        <p className="text-center mt-4 text-sm text-gray-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsSignUp(!isSignUp)} className="text-blue-400 hover:underline">
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  )
}

export default AuthModal
