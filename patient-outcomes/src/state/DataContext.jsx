import { createContext, useContext, useMemo, useState } from 'react'

const DataContext = createContext(null)

const initialData = {
  clinicians: [
    { id: 'c1', firstName: 'Alex', lastName: 'Nguyen' },
    { id: 'c2', firstName: 'Jamie', lastName: 'Rivera' },
  ],
  patients: [
    { id: 'p1', mrn: '10001', firstName: 'Taylor', lastName: 'Morgan' },
    { id: 'p2', mrn: '10002', firstName: 'Jordan', lastName: 'Lee' },
  ],
  encounters: [
    { id: 'e1', patientId: 'p1', clinicianId: 'c1', bodyPart: 'knee', careType: 'ORTHOPEDIC', injuryType: 'ACL sprain', startedAt: '2025-08-01' },
    { id: 'e2', patientId: 'p1', clinicianId: 'c2', bodyPart: 'shoulder', careType: 'ORTHOPEDIC', injuryType: 'Rotator cuff', startedAt: '2025-09-10' },
    { id: 'e3', patientId: 'p2', clinicianId: 'c1', bodyPart: 'back', careType: 'NEUROLOGIC', injuryType: 'Sciatica', startedAt: '2025-09-01' },
  ],
  snapshots: [
    { id: 's1', encounterId: 'e1', surveySchemaId: 'lefs', responses: { q1: 3, q2: 4 }, computedScore: 70, takenAt: '2025-09-15T10:00:00Z' },
    { id: 's2', encounterId: 'e1', surveySchemaId: 'lefs', responses: { q1: 4, q2: 4 }, computedScore: 80, takenAt: '2025-10-01T10:00:00Z' },
  ],
}

export function DataProvider({ children }) {
  const [data, setData] = useState(initialData)

  const addEncounter = ({ patientId, clinicianId, bodyPart, careType, injuryType }) => {
    const id = `e${Date.now()}`
    const startedAt = new Date().toISOString().slice(0, 10)
    setData(prev => ({
      ...prev,
      encounters: [...prev.encounters, { id, patientId, clinicianId, bodyPart, careType, injuryType, startedAt }],
    }))
    return id
  }

  const addSnapshot = ({ encounterId, surveySchemaId, responses }) => {
    const id = `s${Date.now()}`
    const computedScore = Object.values(responses).reduce((a, b) => a + Number(b || 0), 0) * 10
    const takenAt = new Date().toISOString()
    setData(prev => ({
      ...prev,
      snapshots: [...prev.snapshots, { id, encounterId, surveySchemaId, responses, computedScore, takenAt }],
    }))
    return id
  }

  const value = useMemo(() => ({ data, addEncounter, addSnapshot }), [data])
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}


