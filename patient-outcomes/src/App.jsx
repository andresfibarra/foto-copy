import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useData } from './state/DataContext.jsx'
import { Button } from './components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetClose } from './components/ui/sheet'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { currentUser, login, logout } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  
  const toggleDrawer = () => setDrawerOpen(o => !o)
  const closeDrawer = () => setDrawerOpen(false)

  // Redirect to login if not authenticated (except on login page)
  useEffect(() => {
    if (!currentUser && location.pathname !== '/login') {
      navigate('/login')
    }
  }, [currentUser, location.pathname, navigate])

  // Redirect to home if authenticated and on login page
  useEffect(() => {
    if (currentUser && location.pathname === '/login') {
      navigate('/')
    }
  }, [currentUser, location.pathname, navigate])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-24 bg-background border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 space-y-4">
                <Link to="/" onClick={closeDrawer} className="block text-sm font-medium hover:text-primary">
                  Home
                </Link>
                <Link to="/open-episodes" onClick={closeDrawer} className="block text-sm font-medium hover:text-primary">
                  Open Episodes
                </Link>
                <Link to="/patients/new" onClick={closeDrawer} className="block text-sm font-medium hover:text-primary">
                  Create patient
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <h1 className="text-2xl font-bold">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Patient outcomes
            </Link>
          </h1>
          
          <div className="flex items-center gap-4">
            {currentUser && (
              <span className="text-sm text-muted-foreground">
                Welcome, {currentUser.name}
              </span>
            )}
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto px-4 py-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}

export default App
