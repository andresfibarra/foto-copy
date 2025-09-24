import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Stethoscope, BarChart3 } from 'lucide-react'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function EncounterDetailPage() {
  const { encounterId } = useParams()
  const navigate = useNavigate()
  const { data } = useData()

  const encounter = data.encounters.find(e => e.id === encounterId)
  if (!encounter) return <div>Encounter not found</div>
  const patient = data.patients.find(p => p.id === encounter.patientId)
  const clinician = data.clinicians.find(c => c.id === encounter.clinicianId)
  const snapshots = data.snapshots.filter(s => s.encounterId === encounterId)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to={`/patients/${patient.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {patient ? <Link to={`/patients/${patient.id}`} className="text-primary hover:underline">{patient.lastName}, {patient.firstName}</Link> : 'N/A'} - {encounter.injuryType} ({encounter.bodyPart})
          </h1>
          <p className="text-muted-foreground">
            Care Type: {encounter.careType} | Clinician: {clinician ? `${clinician.firstName} ${clinician.lastName}` : 'N/A'} | Started: {encounter.startedAt}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Snapshots</h2>
        <Button onClick={() => navigate(`/encounters/${encounter.id}/snapshots/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Snapshot
        </Button>
      </div>

      <div className="grid gap-4">
        {snapshots.length > 0 ? (
          snapshots.map((snapshot, index) => (
            <motion.div
              key={snapshot.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Snapshot taken on {new Date(snapshot.takenAt).toLocaleDateString()}
                      </CardTitle>
                      <CardDescription>
                        Score: {snapshot.computedScore}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <h4 className="font-semibold mb-2">Responses:</h4>
                    <ul className="space-y-1">
                      {Object.entries(snapshot.responses).map(([key, value]) => (
                        <li key={key} className="text-sm text-muted-foreground">
                          {key}: {value}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No snapshots found for this encounter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}