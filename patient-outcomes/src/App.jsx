import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { useData } from './state/DataContext.jsx'

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
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '100px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ccc', 
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <button 
          onClick={toggleDrawer}
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          ☰
        </button>
        
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
          <Link to="/" style={{ color: '#222', textDecoration: 'none' }}>
            Patient outcomes
          </Link>
        </h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentUser && (
            <span style={{ fontSize: '14px', color: '#666' }}>
              Welcome, {currentUser.name}
            </span>
          )}
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '300px',
          height: '100vh',
          backgroundColor: 'white',
          borderRight: '1px solid #ccc',
          zIndex: 60,
          padding: '20px'
        }}>
          <h2 style={{ marginTop: 0 }}>Navigation</h2>
          <nav style={{ marginTop: '20px' }}>
            <Link 
              to="/" 
              onClick={closeDrawer} 
              style={{ display: 'block', marginBottom: '10px', color: '#2b5bd7' }}
            >
              Home
            </Link>
            <Link 
              to="/open-episodes" 
              onClick={closeDrawer} 
              style={{ display: 'block', marginBottom: '10px', color: '#2b5bd7' }}
            >
              Open Episodes
            </Link>
            <Link 
              to="/patients/new" 
              onClick={closeDrawer} 
              style={{ display: 'block', marginBottom: '10px', color: '#2b5bd7' }}
            >
              Create patient
            </Link>
          </nav>
        </div>
      )}

      {drawerOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 55
          }}
          onClick={closeDrawer}
        />
      )}

      <main style={{ paddingTop: '120px', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default App
