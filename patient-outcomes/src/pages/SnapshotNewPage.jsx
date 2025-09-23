import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Calculator } from 'lucide-react'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle>New Snapshot</CardTitle>
          <CardDescription>
            Complete the survey to create a new snapshot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="q1">Question 1 (0-5)</Label>
                <Input
                  id="q1"
                  type="number"
                  min="0"
                  max="5"
                  value={responses.q1}
                  onChange={e => setResponses(r => ({ ...r, q1: e.target.value }))}
                  placeholder="Enter score 0-5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="q2">Question 2 (0-5)</Label>
                <Input
                  id="q2"
                  type="number"
                  min="0"
                  max="5"
                  value={responses.q2}
                  onChange={e => setResponses(r => ({ ...r, q2: e.target.value }))}
                  placeholder="Enter score 0-5"
                />
              </div>
            </div>

            <Card className="bg-muted/50">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  <span className="font-medium">Preview Score:</span>
                  <span className="text-2xl font-bold text-primary">{computedScore}</span>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Save snapshot
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}