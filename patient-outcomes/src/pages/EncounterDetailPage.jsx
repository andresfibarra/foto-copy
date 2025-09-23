import { Link, useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Calendar, TrendingUp } from 'lucide-react'
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
  const snapshots = data.snapshots.filter(s => s.encounterId === encounterId)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/patients/${patient.id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{encounter.bodyPart}</h1>
          <p className="text-muted-foreground">
            {encounter.careType} • {encounter.injuryType}
          </p>
          <p className="text-sm text-muted-foreground">
            Patient: {patient.firstName} {patient.lastName} • Started: {encounter.startedAt}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Snapshots</h2>
        <Button onClick={() => navigate(`/encounters/${encounterId}/snapshots/new`)}>
          <Plus className="h-4 w-4 mr-2" />
          Create snapshot
        </Button>
      </div>

      <div className="grid gap-4">
        {snapshots.map((s, index) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Snapshot</CardTitle>
                    <CardDescription>
                      {new Date(s.takenAt).toLocaleString()}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                      <TrendingUp className="h-6 w-6" />
                      {s.computedScore}
                    </div>
                    <p className="text-sm text-muted-foreground">Score</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
        {snapshots.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No snapshots yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}