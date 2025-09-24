import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../state/DataContext.jsx'

export default function OpenEpisodesPage() {
  const { data } = useData()
  const [selectedClinician, setSelectedClinician] = useState('all')
  const [entriesPerPage, setEntriesPerPage] = useState(25)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState('id')
  const [sortDirection, setSortDirection] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate episode statistics
  const episodeStats = useMemo(() => {
    const episodes = data.encounters.map(encounter => {
      const patient = data.patients.find(p => p.id === encounter.patientId)
      const clinician = data.clinicians.find(c => c.id === encounter.clinicianId)
      const snapshots = data.snapshots.filter(s => s.encounterId === encounter.id)
      
      const setupDate = new Date(encounter.startedAt)
      const intakeDate = snapshots.length > 0 ? new Date(snapshots[0].takenAt) : null
      const statusDate = snapshots.length > 1 ? new Date(snapshots[snapshots.length - 1].takenAt) : null
      const emailSentDate = new Date(encounter.startedAt)
      emailSentDate.setDate(emailSentDate.getDate() + 30) // Simulate email sent 30 days after setup
      
      const daysSinceSetup = Math.floor((new Date() - setupDate) / (1000 * 60 * 60 * 24))
      const daysSinceIntake = intakeDate ? Math.floor((new Date() - intakeDate) / (1000 * 60 * 60 * 24)) : null
      const daysSinceStatus = statusDate ? Math.floor((new Date() - statusDate) / (1000 * 60 * 60 * 24)) : null
      
      let status = 'In Progress'
      if (daysSinceSetup >= 45) status = 'Inactive 45+ days'
      else if (daysSinceSetup >= 30) status = 'Close 30-44 days'
      else if (daysSinceStatus && daysSinceStatus >= 14) status = 'Status Overdue 14+ days'
      else if (daysSinceIntake && daysSinceIntake >= 7) status = 'Intake Overdue 7+ days'
      
      return {
        id: encounter.id,
        patient: patient,
        clinician: clinician,
        condition: encounter.bodyPart,
        setup: encounter.startedAt,
        intake: intakeDate?.toISOString().split('T')[0] || 'N/A',
        status: statusDate?.toISOString().split('T')[0] || 'N/A',
        emailSent: emailSentDate.toISOString().split('T')[0],
        statusType: status,
        daysSinceSetup,
        daysSinceIntake,
        daysSinceStatus
      }
    })

    const stats = {
      inProgress: episodes.filter(e => e.statusType === 'In Progress').length,
      intakeOverdue: episodes.filter(e => e.statusType === 'Intake Overdue 7+ days').length,
      statusOverdue: episodes.filter(e => e.statusType === 'Status Overdue 14+ days').length,
      close30to44: episodes.filter(e => e.statusType === 'Close 30-44 days').length,
      inactive45plus: episodes.filter(e => e.statusType === 'Inactive 45+ days').length
    }

    return { episodes, stats }
  }, [data])

  // Filter and sort episodes
  const filteredAndSortedEpisodes = useMemo(() => {
    let filtered = episodeStats.episodes

    // Filter by clinician
    if (selectedClinician !== 'all') {
      filtered = filtered.filter(episode => episode.clinician?.id === selectedClinician)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(episode => 
        episode.patient?.firstName.toLowerCase().includes(query) ||
        episode.patient?.lastName.toLowerCase().includes(query) ||
        episode.patient?.mrn.toLowerCase().includes(query) ||
        episode.condition.toLowerCase().includes(query)
      )
    }

    // Sort episodes
    filtered.sort((a, b) => {
      let aVal = a[sortColumn]
      let bVal = b[sortColumn]
      
      if (sortColumn === 'patient') {
        aVal = `${a.patient?.lastName}, ${a.patient?.firstName}`
        bVal = `${b.patient?.lastName}, ${b.patient?.firstName}`
      } else if (sortColumn === 'clinician') {
        aVal = `${a.clinician?.lastName}, ${a.clinician?.firstName}`
        bVal = `${b.clinician?.lastName}, ${b.clinician?.firstName}`
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      
      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [episodeStats.episodes, selectedClinician, searchQuery, sortColumn, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEpisodes.length / entriesPerPage)
  const startIndex = (currentPage - 1) * entriesPerPage
  const paginatedEpisodes = filteredAndSortedEpisodes.slice(startIndex, startIndex + entriesPerPage)

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
    setCurrentPage(1)
  }

  const getStatusColor = (statusType) => {
    switch (statusType) {
      case 'In Progress': return '#22c55e'
      case 'Intake Overdue 7+ days': return '#3b82f6'
      case 'Status Overdue 14+ days': return '#f97316'
      case 'Close 30-44 days': return '#ea580c'
      case 'Inactive 45+ days': return '#dc2626'
      default: return '#6b7280'
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>Open Episodes</h1>
      
      {/* Filters Section */}
      <div>
        <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>Filters</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{
            backgroundColor: '#22c55e',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{episodeStats.stats.inProgress}</div>
            <div style={{ fontSize: '14px' }}>In Progress</div>
            <a href="#" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>More info</a>
          </div>
          
          <div style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{episodeStats.stats.intakeOverdue}</div>
            <div style={{ fontSize: '14px' }}>Intake Overdue 7+ days</div>
            <a href="#" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>More info</a>
          </div>
          
          <div style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{episodeStats.stats.statusOverdue}</div>
            <div style={{ fontSize: '14px' }}>Status Overdue 14+ days</div>
            <a href="#" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>More info</a>
          </div>
          
          <div style={{
            backgroundColor: '#ea580c',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{episodeStats.stats.close30to44}</div>
            <div style={{ fontSize: '14px' }}>Close 30-44 days</div>
            <a href="#" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>More info</a>
          </div>
          
          <div style={{
            backgroundColor: '#dc2626',
            color: 'white',
            padding: '15px',
            borderRadius: '8px',
            minWidth: '150px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{episodeStats.stats.inactive45plus}</div>
            <div style={{ fontSize: '14px' }}>Inactive 45+ days</div>
            <a href="#" style={{ color: 'white', fontSize: '12px', textDecoration: 'underline' }}>More info</a>
          </div>
        </div>
      </div>

      {/* Filter by Clinician */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '10px' }}>Filter by Clinician</h3>
        <select
          value={selectedClinician}
          onChange={(e) => setSelectedClinician(e.target.value)}
          style={{ padding: '8px', minWidth: '200px' }}
        >
          <option value="all">All Clinicians</option>
          {data.clinicians.map(clinician => (
            <option key={clinician.id} value={clinician.id}>
              {clinician.lastName}, {clinician.firstName}
            </option>
          ))}
        </select>
      </div>

      {/* Table Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Show</span>
          <select
            value={entriesPerPage}
            onChange={(e) => {
              setEntriesPerPage(Number(e.target.value))
              setCurrentPage(1)
            }}
            style={{ padding: '5px' }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span>entries</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>Search:</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Search by name or MRN..."
            style={{ padding: '5px 10px', minWidth: '200px' }}
          />
        </div>
      </div>

      {/* Open Episodes Table */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #ccc',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f5f5f5' }}>
            <tr>
              {['id', 'patient', 'clinician', 'condition', 'setup', 'intake', 'status', 'emailSent', 'actions', 'close', 'info'].map(column => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  style={{
                    padding: '12px',
                    textAlign: 'left',
                    borderBottom: '1px solid #ccc',
                    cursor: 'pointer',
                    userSelect: 'none',
                    fontWeight: '600'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {column.charAt(0).toUpperCase() + column.slice(1)}
                    {sortColumn === column && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedEpisodes.map(episode => (
              <tr key={episode.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{episode.id}</td>
                <td style={{ padding: '12px' }}>
                  <Link 
                    to={`/patients/${episode.patient?.id}`}
                    style={{ color: '#2b5bd7', textDecoration: 'none' }}
                  >
                    {episode.patient?.lastName}, {episode.patient?.firstName}
                  </Link>
                </td>
                <td style={{ padding: '12px' }}>
                  {episode.clinician?.lastName}, {episode.clinician?.firstName}
                </td>
                <td style={{ padding: '12px' }}>{episode.condition}</td>
                <td style={{ padding: '12px' }}>{episode.setup}</td>
                <td style={{ padding: '12px' }}>
                  {episode.intake !== 'N/A' ? (
                    <Link 
                      to={`/encounters/${episode.id}`}
                      style={{ color: '#2b5bd7', textDecoration: 'none' }}
                    >
                      {episode.intake}
                    </Link>
                  ) : (
                    episode.intake
                  )}
                </td>
                <td style={{ padding: '12px' }}>
                  {episode.status !== 'N/A' ? (
                    <Link 
                      to={`/encounters/${episode.id}`}
                      style={{ color: '#2b5bd7', textDecoration: 'none' }}
                    >
                      {episode.status}
                    </Link>
                  ) : (
                    episode.status
                  )}
                </td>
                <td style={{ padding: '12px' }}>{episode.emailSent}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      📧
                    </button>
                    <button style={{
                      backgroundColor: '#22c55e',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      padding: '5px 8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      🚀
                    </button>
                  </div>
                </td>
                <td style={{ padding: '12px' }}>
                  <button style={{
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '5px 10px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}>
                    Close
                  </button>
                </td>
                <td style={{ padding: '12px' }}>
                  <span style={{
                    backgroundColor: getStatusColor(episode.statusType),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {episode.statusType.includes('Inactive') ? 'Inactive' : 
                     episode.statusType.includes('Close') ? 'Close' :
                     episode.statusType.includes('Status') ? 'Status' :
                     episode.statusType.includes('Intake') ? 'Intake' : 'Active'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: '#666' }}>
          Showing {startIndex + 1} to {Math.min(startIndex + entriesPerPage, filteredAndSortedEpisodes.length)} of {filteredAndSortedEpisodes.length} entries
        </div>
        
        <div style={{ display: 'flex', gap: '5px' }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              backgroundColor: currentPage === 1 ? '#f5f5f5' : 'white',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Previous
          </button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                style={{
                  padding: '5px 10px',
                  border: '1px solid #ccc',
                  backgroundColor: currentPage === pageNum ? '#2b5bd7' : 'white',
                  color: currentPage === pageNum ? 'white' : 'black',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                {pageNum}
              </button>
            )
          })}
          
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              padding: '5px 10px',
              border: '1px solid #ccc',
              backgroundColor: currentPage === totalPages ? '#f5f5f5' : 'white',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              borderRadius: '4px'
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
