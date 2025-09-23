import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function PatientsPage() {
  const { data } = useData()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data.patients
    return data.patients.filter(p =>
      p.mrn.toLowerCase().includes(q) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    )
  }, [query, data.patients])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', gap: '1rem' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by MRN or name"
          style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}
        />
        <button onClick={() => navigate('/patients/new')}>Create patient</button>
      </div>
      <ul>
        {results.map(p => (
          <li key={p.id} style={{ margin: '0.5rem 0' }}>
            <Link to={`/patients/${p.id}`}>
              {p.lastName}, {p.firstName} — MRN {p.mrn}
            </Link>
          </li>
        ))}
        {results.length === 0 && <li>No patients found.</li>}
      </ul>
    </div>
  )
}


