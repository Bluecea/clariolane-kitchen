import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { supabase } from '../lib/supabase'

export const Login = () => {
  const { user, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) return null
  if (user) return <Navigate to='/dashboard' replace />

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoginLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoginLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center'>
          <h2 className='mt-6 text-3xl font-bold tracking-tight text-slate-900'>
            Sign in to your account
          </h2>
          <p className='mt-2 text-sm text-slate-600'>
            Access the Passage Form Dashboard
          </p>
        </div>

        <Card className='p-8 space-y-6'>
          <form className='space-y-6' onSubmit={handleEmailLogin}>
            <Input
              id='email'
              type='email'
              required
              placeholder='Email address'
              label='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id='password'
              type='password'
              required
              placeholder='Password'
              label='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className='text-sm text-red-600'>{error}</p>}

            <Button
              type='submit'
              className='w-full'
              isLoading={isLoginLoading}
              disabled={!email || !password}>
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
