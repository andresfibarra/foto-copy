import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function PatientDetailPage() {
  const { patientId } = useParams()
  const { data, addEncounter } = useData()
  const patient = data.patients.find(p => p.id === patientId)
  const encounters = useMemo(() => data.encounters.filter(e => e.patientId === patientId), [data.encounters, patientId])

  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ 
    clinicianId: data.clinicians[0]?.id || '', 
    bodyPart: '', 
    careType: 'ORTHOPEDIC', 
    injuryType: '' 
  })

  if (!patient) return <div>Patient not found</div>

  const onSubmit = (e) => {
    e.preventDefault()
    const encounterId = addEncounter({ patientId, ...form })
    setShowModal(false)
    setForm({ clinicianId: data.clinicians[0]?.id || '', bodyPart: '', careType: 'ORTHOPEDIC', injuryType: '' })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2b5bd7' }}>
          ← Back
        </Link>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
            {patient.firstName} {patient.lastName}
          </h1>
          <p style={{ color: '#666', margin: 0 }}>MRN: {patient.mrn}</p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '600', margin: 0 }}>Encounters</h2>
        <button 
          onClick={() => setShowModal(true)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2b5bd7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          + Create new encounter
        </button>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '8px',
            width: '500px',
            maxWidth: '90vw'
          }}>
            <h3 style={{ marginTop: 0 }}>Create new encounter</h3>
            <p style={{ color: '#666', marginBottom: '20px' }}>
              Add a new injury/care episode for this patient
            </p>
            
            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Clinician
                </label>
                <select
                  value={form.clinicianId}
                  onChange={e => setForm(f => ({ ...f, clinicianId: e.target.value }))}
                  style={{ width: '100%', padding: '8px' }}
                >
                  {data.clinicians.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.lastName}, {c.firstName}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Body part
                </label>
                <input
                  value={form.bodyPart}
                  onChange={e => setForm(f => ({ ...f, bodyPart: e.target.value }))}
                  placeholder="e.g., knee, shoulder"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Care type
                </label>
                <select
                  value={form.careType}
                  onChange={e => setForm(f => ({ ...f, careType: e.target.value }))}
                  style={{ width: '100%', padding: '8px' }}
                >
                  <option value="ORTHOPEDIC">Orthopedic</option>
                  <option value="NEUROLOGIC">Neurologic</option>
                  <option value="PELVIC_FLOOR">Pelvic Floor</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Injury type
                </label>
                <input
                  value={form.injuryType}
                  onChange={e => setForm(f => ({ ...f, injuryType: e.target.value }))}
                  placeholder="e.g., ACL sprain, rotator cuff tear"
                  style={{ width: '100%', padding: '8px' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '10px', paddingTop: '20px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f0f0f0',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2b5bd7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {encounters.map(e => (
          <div
            key={e.id}
            style={{
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '15px',
              cursor: 'pointer'
            }}
          >
            <Link to={`/encounters/${e.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px' }}>{e.bodyPart}</h3>
                  <p style={{ margin: 0, color: '#666' }}>{e.careType} • {e.injuryType}</p>
                </div>
                <div style={{ textAlign: 'right', fontSize: '14px', color: '#666' }}>
                  <div>📅 {e.startedAt}</div>
                  <div>👨‍⚕️ {data.clinicians.find(c => c.id === e.clinicianId)?.lastName}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
        {encounters.length === 0 && (
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            color: '#666'
          }}>
            No encounters yet.
          </div>
        )}
      </div>
    </div>
  )
}