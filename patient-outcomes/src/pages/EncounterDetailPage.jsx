import { Link, useParams, useNavigate } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function EncounterDetailPage() {
  const { encounterId } = useParams()
  const navigate = useNavigate()
  const { data } = useData()

  const encounter = data.encounters.find(e => e.id === encounterId)
  if (!encounter) return <div>Encounter not found</div>
  const patient = data.patients.find(p => p.id === encounter.patientId)
  const snapshots = data.snapshots.filter(s => s.encounterId === encounterId)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link to={`/patients/${patient.id}`} style={{ textDecoration: 'none', color: '#2b5bd7' }}>
          ← Back
        </Link>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            {patient.firstName} {patient.lastName}
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            {encounter.bodyPart} • {encounter.careType} • {encounter.injuryType}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Snapshots</h2>
        <button 
          onClick={() => navigate(`/encounters/${encounterId}/snapshots/new`)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2b5bd7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Create snapshot
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {snapshots.map(snapshot => (
          <div
            key={snapshot.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px' }}>
                  📅 {new Date(snapshot.takenAt).toLocaleDateString()}
                </h3>
                <p style={{ margin: 0, color: '#666' }}>
                  Score: {snapshot.computedScore}
                </p>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2b5bd7' }}>
                {snapshot.computedScore}
              </div>
            </div>
            <div style={{ marginTop: '10px' }}>
              <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Responses:</h4>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {Object.entries(snapshot.responses).map(([key, value]) => (
                  <li key={key} style={{ fontSize: '14px' }}>
                    {key}: {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {snapshots.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            No snapshots yet.
          </div>
        )}
      </div>
    </div>
  )
}