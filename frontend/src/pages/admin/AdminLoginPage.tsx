import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface LoginResponse {
  token: string
  user: { id: number; name: string; email: string; role: string }
  message: string
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@zeronixav.com')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const login = useAuthStore((state) => state.login)
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')

    try {
      const res = await api.post<LoginResponse>('/api/v1/admin/login', { email, password })
      if (res?.token && res?.user) {
        login(res.token, res.user)
        navigate('/admin', { replace: true })
        return
      }
      setErrorMsg('Unexpected response from server.')
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Invalid credentials. Please verify your email and password.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4 font-sans">
      <Card className="max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="items-center text-center">
          <div className="w-10 h-10 rounded-md bg-accent/10 border border-accent/30 flex items-center justify-center text-accent">
            <Shield className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-text-primary tracking-tight mt-1">
            Admin Console
          </h1>
          <p className="text-xs text-text-secondary">Sign in to manage the catalog</p>
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-sm bg-danger/10 border border-danger/30 text-danger text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@zeronixav.com"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
