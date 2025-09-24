import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ChevronUp, ChevronDown, Mail, Rocket, X } from 'lucide-react'
import { useData } from '../state/DataContext.jsx'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

export default function OpenEpisodesPage() {
  const { data } = useData()
  const [filterClinician, setFilterClinician] = useState('All Clinicians')
  const [searchTerm, setSearchTerm] = useState('')
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })

  const allEpisodes = useMemo(() => {
    return data.encounters.map(encounter => {
      const patient = data.patients.find(p => p.id === encounter.patientId)
      const clinician = data.clinicians.find(c => c.id === encounter.clinicianId)
      const snapshots = data.snapshots.filter(s => s.encounterId === encounter.id)

      // Calculate status based on dates (simplified for demo)
      const today = new Date()
      const startedAtDate = new Date(encounter.startedAt)
      let status = 'In Progress'
      let statusColor = 'bg-green-500'

      const diffDays = (date1, date2) => Math.ceil(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24))

      // Example logic for statuses
      if (diffDays(today, startedAtDate) > 45) {
        status = 'Inactive 45+ days'
        statusColor = 'bg-red-500'
      } else if (diffDays(today, startedAtDate) > 30) {
        status = 'Close 30-44 days'
        statusColor = 'bg-orange-500'
      } else if (diffDays(today, startedAtDate) > 14) {
        status = 'Status Overdue 14+ days'
        statusColor = 'bg-yellow-500'
      } else if (diffDays(today, startedAtDate) > 7) {
        status = 'Intake Overdue 7+ days'
        statusColor = 'bg-blue-500'
      }

      return {
        id: encounter.id,
        patientId: patient?.id,
        patientName: `${patient?.lastName}, ${patient?.firstName}`,
        patientMRN: patient?.mrn,
        clinicianName: `${clinician?.lastName}, ${clinician?.firstName}`,
        condition: encounter.bodyPart,
        setupDate: encounter.startedAt,
        intakeDate: encounter.startedAt,
        statusDate: new Date(startedAtDate.setDate(startedAtDate.getDate() + 30)).toISOString().slice(0, 10),
        emailSent: new Date(startedAtDate.setDate(startedAtDate.getDate() + 15)).toISOString().slice(0, 10),
        status: status,
        statusColor: statusColor,
      }
    })
  }, [data])

  const filteredEpisodes = useMemo(() => {
    let filtered = allEpisodes

    if (filterClinician !== 'All Clinicians') {
      filtered = filtered.filter(episode => episode.clinicianName.includes(filterClinician))
    }

    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase()
      filtered = filtered.filter(episode =>
        episode.patientName.toLowerCase().includes(lowerCaseSearchTerm) ||
        episode.patientMRN.toLowerCase().includes(lowerCaseSearchTerm)
      )
    }
    return filtered
  }, [allEpisodes, filterClinician, searchTerm])

  const sortedEpisodes = useMemo(() => {
    if (!sortConfig.key) return filteredEpisodes

    return [...filteredEpisodes].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue < bValue) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }, [filteredEpisodes, sortConfig])

  const paginatedEpisodes = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage
    const endIndex = startIndex + entriesPerPage
    return sortedEpisodes.slice(startIndex, endIndex)
  }, [sortedEpisodes, currentPage, entriesPerPage])

  const totalPages = Math.ceil(filteredEpisodes.length / entriesPerPage)

  const requestSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const getStatusCounts = useMemo(() => {
    const counts = {
      'In Progress': 0,
      'Intake Overdue 7+ days': 0,
      'Status Overdue 14+ days': 0,
      'Close 30-44 days': 0,
      'Inactive 45+ days': 0,
    }
    allEpisodes.forEach(episode => {
      if (counts.hasOwnProperty(episode.status)) {
        counts[episode.status]++
      }
    })
    return counts
  }, [allEpisodes])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Open Episodes</h1>

      {/* Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {Object.entries(getStatusCounts).map(([status, count]) => (
          <Card key={status} className="text-white">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm">{status}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Clinician</label>
              <Select value={filterClinician} onValueChange={(value) => {
                setFilterClinician(value)
                setCurrentPage(1)
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Clinicians">All Clinicians</SelectItem>
                  {data.clinicians.map(c => (
                    <SelectItem key={c.id} value={`${c.lastName}, ${c.firstName}`}>
                      {c.lastName}, {c.firstName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by name or MRN"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Show entries</label>
              <Select value={entriesPerPage.toString()} onValueChange={(value) => {
                setEntriesPerPage(Number(value))
                setCurrentPage(1)
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Episodes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Open Episodes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  {[
                    { key: 'id', label: 'Id' },
                    { key: 'patientName', label: 'Patient' },
                    { key: 'clinicianName', label: 'Clinician' },
                    { key: 'condition', label: 'Condition' },
                    { key: 'setupDate', label: 'Setup' },
                    { key: 'intakeDate', label: 'Intake' },
                    { key: 'statusDate', label: 'Status' },
                    { key: 'emailSent', label: 'Email Sent' },
                    { key: 'actions', label: 'Actions' },
                    { key: 'close', label: 'Close' },
                    { key: 'status', label: 'Info' },
                  ].map(col => (
                    <th
                      key={col.key}
                      onClick={() => requestSort(col.key)}
                      className="text-left p-3 cursor-pointer hover:bg-muted"
                    >
                      <div className="flex items-center gap-1">
                        {col.label}
                        {sortConfig.key === col.key && (
                          sortConfig.direction === 'ascending' ? 
                            <ChevronUp className="h-4 w-4" /> : 
                            <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginatedEpisodes.length > 0 ? (
                  paginatedEpisodes.map(episode => (
                    <tr key={episode.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">{episode.id}</td>
                      <td className="p-3">
                        <Link to={`/patients/${episode.patientId}`} className="text-primary hover:underline">
                          {episode.patientName}
                        </Link>
                      </td>
                      <td className="p-3">{episode.clinicianName}</td>
                      <td className="p-3">{episode.condition}</td>
                      <td className="p-3">{episode.setupDate}</td>
                      <td className="p-3">
                        <Link to={`/encounters/${episode.id}`} className="text-primary hover:underline">
                          {episode.intakeDate}
                        </Link>
                      </td>
                      <td className="p-3">
                        <Link to={`/encounters/${episode.id}`} className="text-primary hover:underline">
                          {episode.statusDate}
                        </Link>
                      </td>
                      <td className="p-3">{episode.emailSent}</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Rocket className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="p-3">
                        <Button size="sm" variant="destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs text-white ${episode.statusColor}`}>
                          {episode.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center p-6 text-muted-foreground">
                      No open episodes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * entriesPerPage + 1, filteredEpisodes.length)} to {Math.min(currentPage * entriesPerPage, filteredEpisodes.length)} of {filteredEpisodes.length} entries
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}