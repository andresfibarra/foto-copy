import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'
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
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Create New Snapshot
            </CardTitle>
            <CardDescription>
              Fill out the survey for this encounter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="q1">Question 1 (0-10 scale)</Label>
                  <Input
                    id="q1"
                    type="number"
                    min="0"
                    max="10"
                    value={responses.q1}
                    onChange={(e) => setResponses(prev => ({ ...prev, q1: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="q2">Question 2 (0-10 scale)</Label>
                  <Input
                    id="q2"
                    type="number"
                    min="0"
                    max="10"
                    value={responses.q2}
                    onChange={(e) => setResponses(prev => ({ ...prev, q2: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="text-lg font-semibold text-center">
                  Computed Score Preview: {computedScore}
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/encounters/${encounterId}`)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Create Snapshot
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}