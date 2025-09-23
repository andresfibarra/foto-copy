import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Plus, User } from 'lucide-react'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function PatientsPage() {
  const { data } = useData()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return data.patients
    return data.patients.filter(p =>
      p.mrn.toLowerCase().includes(q) ||
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)
    )
  }, [query, data.patients])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by MRN or name"
            className="pl-10"
          />
        </div>
        <Button onClick={() => navigate('/patients/new')} className="sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Create patient
        </Button>
      </div>

      <div className="grid gap-4">
        {results.map((p, index) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <Link to={`/patients/${p.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {p.lastName}, {p.firstName}
                      </CardTitle>
                      <CardDescription>
                        MRN: {p.mrn}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Link>
            </Card>
          </motion.div>
        ))}
        {results.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No patients found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}