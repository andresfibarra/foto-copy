import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import './App.css'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const toggleDrawer = () => setDrawerOpen(o => !o)
  const closeDrawer = () => setDrawerOpen(false)

  return (
    <div>
      <header className="page-header">
        <button
          aria-label="Open navigation"
          className="hamburger"
          onClick={toggleDrawer}
        >
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
          <span className="hamburger-bar" />
        </button>
        <h1>
          <Link to="/" className="page-title">Patient outcomes</Link>
        </h1>
        <div className="header-spacer" />
      </header>

      <aside className={`nav-drawer${drawerOpen ? ' open' : ''}`} aria-hidden={!drawerOpen}>
        <nav className="nav-menu">
          <button className="nav-close" onClick={closeDrawer} aria-label="Close navigation">×</button>
          <ul>
            <li><Link to="/" onClick={closeDrawer}>Home</Link></li>
            <li><Link to="/patients/new" onClick={closeDrawer}>Create patient</Link></li>
          </ul>
        </nav>
      </aside>
      {drawerOpen && <div className="drawer-backdrop" onClick={closeDrawer} />}

      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
