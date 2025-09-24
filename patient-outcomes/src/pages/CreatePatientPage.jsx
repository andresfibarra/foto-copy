import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function CreatePatientPage() {
  const navigate = useNavigate()
  const { addPatient } = useData()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    mrn: '',
    sex: '',
    language: '',
    dateOfBirth: '',
  })

  const onSubmit = (e) => {
    e.preventDefault()
    const id = addPatient(form)
    navigate(`/patients/${id}`)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>Create Patient</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Add a new patient to the system
        </p>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="firstName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                First name *
              </label>
              <input
                id="firstName"
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
            <div>
              <label htmlFor="lastName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Last name *
              </label>
              <input
                id="lastName"
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                required
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="preferredName" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Preferred name
            </label>
            <input
              id="preferredName"
              value={form.preferredName}
              onChange={e => setForm(f => ({ ...f, preferredName: e.target.value }))}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div>
            <label htmlFor="mrn" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Patient ID (MRN) *
            </label>
            <input
              id="mrn"
              value={form.mrn}
              onChange={e => setForm(f => ({ ...f, mrn: e.target.value }))}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label htmlFor="sex" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Biological sex *
              </label>
              <select
                id="sex"
                value={form.sex}
                onChange={e => setForm(f => ({ ...f, sex: e.target.value }))}
                required
                style={{ width: '100%', padding: '8px' }}
              >
                <option value="">Select...</option>
                <option value="F">Female</option>
                <option value="M">Male</option>
                <option value="X">Intersex/Other</option>
                <option value="U">Prefer not to say</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                Language
              </label>
              <input
                id="language"
                value={form.language}
                onChange={e => setForm(f => ({ ...f, language: e.target.value }))}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          </div>

          <div>
            <label htmlFor="dateOfBirth" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Date of birth
            </label>
            <input
              id="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))}
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', paddingTop: '20px' }}>
            <button 
              type="button" 
              onClick={() => navigate(-1)}
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
  )
}