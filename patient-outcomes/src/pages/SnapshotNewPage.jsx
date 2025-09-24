import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function SnapshotNewPage() {
  const { encounterId } = useParams()
  const navigate = useNavigate()
  const { addSnapshot } = useData()
  const [responses, setResponses] = useState({ q1: '', q2: '' })

  const computedScore = (Number(responses.q1 || 0) + Number(responses.q2 || 0)) * 10

  const onSubmit = (e) => {
    e.preventDefault()
    const id = addSnapshot({ encounterId, surveySchemaId: 'simple', responses })
    navigate(`/encounters/${encounterId}`)
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ marginTop: 0 }}>Create Snapshot</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Fill out the survey for this encounter
        </p>
        
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="q1" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Question 1 (0-10 scale)
            </label>
            <input
              id="q1"
              type="number"
              min="0"
              max="10"
              value={responses.q1}
              onChange={e => setResponses(r => ({ ...r, q1: e.target.value }))}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div>
            <label htmlFor="q2" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Question 2 (0-10 scale)
            </label>
            <input
              id="q2"
              type="number"
              min="0"
              max="10"
              value={responses.q2}
              onChange={e => setResponses(r => ({ ...r, q2: e.target.value }))}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </div>
          
          <div style={{
            padding: '15px',
            backgroundColor: '#f0f8ff',
            border: '1px solid #2b5bd7',
            borderRadius: '4px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: 0, color: '#2b5bd7' }}>
              Computed Score: {computedScore}
            </h3>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', paddingTop: '20px' }}>
            <button 
              type="button" 
              onClick={() => navigate(`/encounters/${encounterId}`)}
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
              Create Snapshot
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}