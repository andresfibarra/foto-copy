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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by MRN or name"
          style={{ flex: 1, padding: '10px' }}
        />
        <button onClick={() => navigate('/patients/new')}>
          + Create patient
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {results.map(p => (
          <div
            key={p.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer'
            }}
          >
            <Link to={`/patients/${p.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  👤
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>
                    {p.lastName}, {p.firstName}
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    MRN: {p.mrn}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {results.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            No patients found.
          </div>
        )}
      </div>
    </div>
  )
}