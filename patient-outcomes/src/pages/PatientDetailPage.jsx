import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function PatientDetailPage() {
  const { patientId } = useParams()
  const { data, addEncounter } = useData()
  const patient = data.patients.find(p => p.id === patientId)
  const encounters = useMemo(() => data.encounters.filter(e => e.patientId === patientId), [data.encounters, patientId])

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ clinicianId: data.clinicians[0]?.id || '', bodyPart: '', careType: 'ORTHOPEDIC', injuryType: '' })

  if (!patient) return <div>Patient not found</div>

  const onSubmit = (e) => {
    e.preventDefault()
    const encounterId = addEncounter({ patientId, ...form })
    setShowModal(false)
    setForm({ clinicianId: data.clinicians[0]?.id || '', bodyPart: '', careType: 'ORTHOPEDIC', injuryType: '' })
  }

  return (
    <div>
      <h2>{patient.firstName} {patient.lastName} — MRN {patient.mrn}</h2>
      <button onClick={() => setShowModal(true)}>Create new encounter</button>
      <ul style={{ marginTop: '1rem' }}>
        {encounters.map(e => (
          <li key={e.id} style={{ margin: '0.5rem 0' }}>
            <Link to={`/encounters/${e.id}`}>
              {e.startedAt} • {e.bodyPart} • {e.careType} • {e.injuryType}
            </Link>
          </li>
        ))}
        {encounters.length === 0 && <li>No encounters yet.</li>}
      </ul>

      {showModal && (
        <div style={backdropStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h3>Create new encounter</h3>
            <form onSubmit={onSubmit}>
              <label>
                Clinician
                <select value={form.clinicianId} onChange={e => setForm(f => ({ ...f, clinicianId: e.target.value }))}>
                  {data.clinicians.map(c => (
                    <option key={c.id} value={c.id}>{c.lastName}, {c.firstName}</option>
                  ))}
                </select>
              </label>
              <label>
                Body part
                <input value={form.bodyPart} onChange={e => setForm(f => ({ ...f, bodyPart: e.target.value }))} />
              </label>
              <label>
                Care type
                <select value={form.careType} onChange={e => setForm(f => ({ ...f, careType: e.target.value }))}>
                  <option value="ORTHOPEDIC">orthopedic</option>
                  <option value="NEUROLOGIC">neurologic</option>
                  <option value="PELVIC_FLOOR">pelvic floor</option>
                </select>
              </label>
              <label>
                Injury type
                <input value={form.injuryType} onChange={e => setForm(f => ({ ...f, injuryType: e.target.value }))} />
              </label>
              <div style={{ marginTop: '1rem' }}>
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowModal(false)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

const backdropStyle = {
  position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
}
const modalStyle = {
  background: 'white', padding: '1rem', borderRadius: '8px', width: 'min(560px, 92vw)'
}


