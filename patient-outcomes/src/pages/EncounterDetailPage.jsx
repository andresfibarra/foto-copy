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
    <div>
      <p>
        <Link to={`/patients/${patient.id}`}>&larr; Back to {patient.firstName} {patient.lastName}</Link>
      </p>
      <h2>{encounter.bodyPart} • {encounter.careType} • {encounter.injuryType}</h2>
      <p>Started: {encounter.startedAt} — Clinician: {data.clinicians.find(c => c.id === encounter.clinicianId)?.lastName}</p>
      <button onClick={() => navigate(`/encounters/${encounterId}/snapshots/new`)}>Create snapshot</button>

      <h3 style={{ marginTop: '1rem' }}>Snapshots</h3>
      <ul>
        {snapshots.map(s => (
          <li key={s.id}>
            {new Date(s.takenAt).toLocaleString()} — Score: {s.computedScore}
          </li>
        ))}
        {snapshots.length === 0 && <li>No snapshots yet.</li>}
      </ul>
    </div>
  )
}


