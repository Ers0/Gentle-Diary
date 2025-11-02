import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/integrations/supabase/client'

interface AuthContextType {
  session: any
  user: any
  signIn: (email: string, password: string) => Promise<any>
  signUp: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider mounted, Supabase client:', supabase ? 'Available' : 'Not available')
    
    // If Supabase isn't configured, skip auth setup
    if (!supabase) {
      console.log('Supabase not available, skipping auth setup')
      setLoading(false)
      return
    }

    const getSession = async () => {
      try {
        console.log('Getting session from Supabase')
        const { data: { session } } = await supabase.auth.getSession()
        console.log('Session retrieved:', session ? 'User logged in' : 'No active session')
        setSession(session)
      } catch (error) {
        console.error('Error getting session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', _event, session ? 'User logged in' : 'User logged out')
      setSession(session)
      setLoading(false)
    })

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }
    console.log('Signing in with email:', email)
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      throw new Error('Supabase is not configured')
    }
    console.log('Signing up with email:', email)
    return await supabase.auth.signUp({ email, password })
  }

  const signOut = async () => {
    if (!supabase) {
      setSession(null)
      return Promise.resolve()
    }
    console.log('Signing out')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error signing out:', error)
      throw error
    }
    setSession(null)
  }

  const value = {
    session,
    user: session?.user,
    signIn,
    signUp,
    signOut,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}