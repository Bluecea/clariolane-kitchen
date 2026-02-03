import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { type User, type Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const allowedEmailsStr = import.meta.env.VITE_ALLOWED_EMAILS || ''
  // Handle both comma-separated string and potential JSON string if user prefers
  let allowedEmails: string[] = []
  try {
    allowedEmails = allowedEmailsStr.startsWith('[')
      ? JSON.parse(allowedEmailsStr)
      : allowedEmailsStr.split(',').map((e: string) => e.trim())
  } catch (e) {
    console.warn('Failed to parse VITE_ALLOWED_EMAILS', e)
    allowedEmails = []
  }

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      if (
        allowedEmails.length > 0 &&
        !allowedEmails.includes(session.user.email || '')
      ) {
        console.warn('Unauthorized email:', session.user.email)
        await supabase.auth.signOut()
        setUser(null)
        setSession(null)
        alert('Access denied: Your email is not authorized.')
      } else {
        setSession(session)
        setUser(session.user)
      }
    } else {
      setSession(null)
      setUser(null)
    }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
    if (error) throw error
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, session, loading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
