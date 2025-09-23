import { Outlet, Link } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <div>
      <header className="page-header">
        <h1>
          <Link to="/" className="page-title">Patient outcomes</Link>
        </h1>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default App
