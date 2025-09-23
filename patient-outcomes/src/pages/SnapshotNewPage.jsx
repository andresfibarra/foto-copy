import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function SnapshotNewPage() {
  const { encounterId } = useParams()
  const navigate = useNavigate()
  const { addSnapshot } = useData()
  const [responses, setResponses] = useState({ q1: '', q2: '' })

  const computedScore = Number(responses.q1 || 0) + Number(responses.q2 || 0)

  const onSubmit = (e) => {
    e.preventDefault()
    const id = addSnapshot({ encounterId, surveySchemaId: 'simple', responses })
    navigate(`/encounters/${encounterId}`)
  }

  return (
    <div>
      <h2>New Snapshot</h2>
      <form onSubmit={onSubmit}>
        <label>
          Question 1 (0-5)
          <input type="number" min="0" max="5" value={responses.q1} onChange={e => setResponses(r => ({ ...r, q1: e.target.value }))} />
        </label>
        <label>
          Question 2 (0-5)
          <input type="number" min="0" max="5" value={responses.q2} onChange={e => setResponses(r => ({ ...r, q2: e.target.value }))} />
        </label>
        <p>Preview score: {computedScore * 10}</p>
        <button type="submit">Save snapshot</button>
        <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: '0.5rem' }}>Cancel</button>
      </form>
    </div>
  )
}


