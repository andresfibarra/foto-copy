import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Plus, User, Calendar, Stethoscope } from 'lucide-react'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet'

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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {patient.firstName} {patient.lastName}
          </h1>
          <p className="text-muted-foreground">MRN: {patient.mrn}</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Encounters</h2>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Encounter
        </Button>
      </div>

      <div className="grid gap-4">
        {encounters.length > 0 ? (
          encounters.map((encounter, index) => (
            <motion.div
              key={encounter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <Link to={`/encounters/${encounter.id}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {encounter.injuryType} ({encounter.bodyPart})
                        </CardTitle>
                        <CardDescription>
                          Care Type: {encounter.careType} | Clinician: {data.clinicians.find(c => c.id === encounter.clinicianId)?.firstName} {data.clinicians.find(c => c.id === encounter.clinicianId)?.lastName} | Started: {encounter.startedAt}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Link>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No encounters found for this patient.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Sheet open={showModal} onOpenChange={setShowModal}>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle>Create New Encounter</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <p className="text-muted-foreground mb-6">
              Fill in the details for the new patient encounter.
            </p>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinicianId">Clinician</Label>
                <Select value={form.clinicianId} onValueChange={(value) => setForm(prev => ({ ...prev, clinicianId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select clinician" />
                  </SelectTrigger>
                  <SelectContent>
                    {data.clinicians.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bodyPart">Body Part</Label>
                <Input
                  id="bodyPart"
                  value={form.bodyPart}
                  onChange={e => setForm(prev => ({ ...prev, bodyPart: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="careType">Care Type</Label>
                <Select value={form.careType} onValueChange={(value) => setForm(prev => ({ ...prev, careType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select care type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ORTHOPEDIC">Orthopedic</SelectItem>
                    <SelectItem value="NEUROLOGIC">Neurologic</SelectItem>
                    <SelectItem value="PELVIC_FLOOR">Pelvic Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="injuryType">Injury Type</Label>
                <Input
                  id="injuryType"
                  value={form.injuryType}
                  onChange={e => setForm(prev => ({ ...prev, injuryType: e.target.value }))}
                  required
                />
              </div>
              <div className="flex gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Encounter
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}