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
    <div>
      <h2>Create patient</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
        <label>
          First name
          <input value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
        </label>
        <label>
          Last name
          <input value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
        </label>
        <label>
          Preferred name
          <input value={form.preferredName} onChange={e => setForm(f => ({ ...f, preferredName: e.target.value }))} />
        </label>
        <label>
          Patient ID (MRN)
          <input value={form.mrn} onChange={e => setForm(f => ({ ...f, mrn: e.target.value }))} required />
        </label>
        <label>
          Biological sex
          <select value={form.sex} onChange={e => setForm(f => ({ ...f, sex: e.target.value }))} required>
            <option value="">Select…</option>
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="X">Intersex/Other</option>
            <option value="U">Prefer not to say</option>
          </select>
        </label>
        <label>
          Language
          <input value={form.language} onChange={e => setForm(f => ({ ...f, language: e.target.value }))} />
        </label>
        <label>
          Date of birth
          <input type="date" value={form.dateOfBirth} onChange={e => setForm(f => ({ ...f, dateOfBirth: e.target.value }))} />
        </label>
        <div style={{ marginTop: '0.5rem' }}>
          <button type="button" onClick={() => navigate(-1)} style={{ marginRight: '0.5rem' }}>Cancel</button>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}


