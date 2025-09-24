import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useData()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Hardcoded credentials
    if (username === 'agilept/aides.pa' && password === 'aides.PA') {
      login({
        username: 'agilept/aides.pa',
        name: 'Agile PT Aides',
        role: 'admin'
      })
      navigate('/')
    } else {
      setError('Invalid username or password')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Patient Outcomes</CardTitle>
            <CardDescription className="text-lg">Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {error && (
                <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm text-center">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-md">
              <h4 className="font-semibold text-sm mb-2">Demo Credentials:</h4>
              <p className="text-sm text-muted-foreground">
                Username: <code className="bg-background px-1 rounded">agilept/aides.pa</code><br />
                Password: <code className="bg-background px-1 rounded">aides.PA</code>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
