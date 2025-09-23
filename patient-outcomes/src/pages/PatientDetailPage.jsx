import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, Calendar, User, Stethoscope } from 'lucide-react'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{patient.firstName} {patient.lastName}</h1>
          <p className="text-muted-foreground">MRN: {patient.mrn}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Encounters</h2>
        <Sheet open={showModal} onOpenChange={setShowModal}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create new encounter
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Create new encounter</SheetTitle>
              <SheetDescription>
                Add a new injury/care episode for this patient
              </SheetDescription>
            </SheetHeader>
            <form onSubmit={onSubmit} className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label>Clinician</Label>
                <Select value={form.clinicianId} onValueChange={value => setForm(f => ({ ...f, clinicianId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinician" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.clinicians.map(c => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.lastName}, {c.firstName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Body part</Label>
                <Input
                  value={form.bodyPart}
                  onChange={e => setForm(f => ({ ...f, bodyPart: e.target.value }))}
                  placeholder="e.g., knee, shoulder"
                />
              </div>
              <div className="space-y-2">
                <Label>Care type</Label>
                <Select value={form.careType} onValueChange={value => setForm(f => ({ ...f, careType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORTHOPEDIC">Orthopedic</SelectItem>
                    <SelectItem value="NEUROLOGIC">Neurologic</SelectItem>
                    <SelectItem value="PELVIC_FLOOR">Pelvic Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Injury type</Label>
                <Input
                  value={form.injuryType}
                  onChange={e => setForm(f => ({ ...f, injuryType: e.target.value }))}
                  placeholder="e.g., ACL sprain, rotator cuff tear"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4">
        {encounters.map((e, index) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <Link to={`/encounters/${e.id}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{e.bodyPart}</CardTitle>
                      <CardDescription>{e.careType} • {e.injuryType}</CardDescription>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {e.startedAt}
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="h-3 w-3" />
                        {data.clinicians.find(c => c.id === e.clinicianId)?.lastName}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          </motion.div>
        ))}
        {encounters.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No encounters yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  )
}