/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const DataContext = createContext(null)

const initialData = {
  // User profile - all patient data is associated with this user
  user: {
    id: 'agilept-aides',
    username: 'agilept/aides.pa',
    name: 'Agile PT Aides',
    role: 'admin'
  },
  clinicians: [
    { id: 'c1', firstName: 'Alex', lastName: 'Nguyen', userId: 'agilept-aides' },
    { id: 'c2', firstName: 'Jamie', lastName: 'Rivera', userId: 'agilept-aides' },
  ],
  patients: [
    { id: 'p1', mrn: '10001', firstName: 'Taylor', lastName: 'Morgan', preferredName: 'Tay', sex: 'F', language: 'English', dateOfBirth: '1990-01-01', userId: 'agilept-aides' },
    { id: 'p2', mrn: '10002', firstName: 'Jordan', lastName: 'Lee', preferredName: 'J', sex: 'M', language: 'Spanish', dateOfBirth: '1987-05-20', userId: 'agilept-aides' },
  ],
  encounters: [
    { id: 'e1', patientId: 'p1', clinicianId: 'c1', bodyPart: 'knee', careType: 'ORTHOPEDIC', injuryType: 'ACL sprain', startedAt: '2025-08-01', userId: 'agilept-aides' },
    { id: 'e2', patientId: 'p1', clinicianId: 'c2', bodyPart: 'shoulder', careType: 'ORTHOPEDIC', injuryType: 'Rotator cuff', startedAt: '2025-09-10', userId: 'agilept-aides' },
    { id: 'e3', patientId: 'p2', clinicianId: 'c1', bodyPart: 'back', careType: 'NEUROLOGIC', injuryType: 'Sciatica', startedAt: '2025-09-01', userId: 'agilept-aides' },
  ],
  snapshots: [
    { id: 's1', encounterId: 'e1', surveySchemaId: 'lefs', responses: { q1: 3, q2: 4 }, computedScore: 70, takenAt: '2025-09-15T10:00:00Z', userId: 'agilept-aides' },
    { id: 's2', encounterId: 'e1', surveySchemaId: 'lefs', responses: { q1: 4, q2: 4 }, computedScore: 80, takenAt: '2025-10-01T10:00:00Z', userId: 'agilept-aides' },
  ],
}

export function DataProvider({ children }) {
  const [data, setData] = useState(initialData)
  const [currentUser, setCurrentUser] = useState(null)

  const login = (user) => {
    setCurrentUser(user)
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const addEncounter = ({ patientId, clinicianId, bodyPart, careType, injuryType }) => {
    const id = `e${Date.now()}`
    const startedAt = new Date().toISOString().slice(0, 10)
    setData(prev => ({
      ...prev,
      encounters: [...prev.encounters, { id, patientId, clinicianId, bodyPart, careType, injuryType, startedAt, userId: currentUser?.id || 'agilept-aides' }],
    }))
    return id
  }

  const addSnapshot = ({ encounterId, surveySchemaId, responses }) => {
    const id = `s${Date.now()}`
    const computedScore = Object.values(responses).reduce((a, b) => a + Number(b || 0), 0) * 10
    const takenAt = new Date().toISOString()
    setData(prev => ({
      ...prev,
      snapshots: [...prev.snapshots, { id, encounterId, surveySchemaId, responses, computedScore, takenAt, userId: currentUser?.id || 'agilept-aides' }],
    }))
    return id
  }

  const addPatient = ({ firstName, lastName, preferredName, mrn, sex, language, dateOfBirth }) => {
    const id = `p${Date.now()}`
    setData(prev => ({
      ...prev,
      patients: [...prev.patients, { id, firstName, lastName, preferredName, mrn, sex, language, dateOfBirth, userId: currentUser?.id || 'agilept-aides' }],
    }))
    return id
  }

  const value = useMemo(() => ({ 
    data, 
    currentUser, 
    login, 
    logout, 
    addEncounter, 
    addSnapshot, 
    addPatient 
  }), [data, currentUser])
  
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}


