import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import PatientsPage from './pages/PatientsPage.jsx'
import PatientDetailPage from './pages/PatientDetailPage.jsx'
import EncounterDetailPage from './pages/EncounterDetailPage.jsx'
import SnapshotNewPage from './pages/SnapshotNewPage.jsx'
import CreatePatientPage from './pages/CreatePatientPage.jsx'
import { DataProvider } from './state/DataContext.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <PatientsPage /> },
      { path: 'patients/new', element: <CreatePatientPage /> },
      { path: 'patients/:patientId', element: <PatientDetailPage /> },
      { path: 'encounters/:encounterId', element: <EncounterDetailPage /> },
      { path: 'encounters/:encounterId/snapshots/new', element: <SnapshotNewPage /> },
    ],
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  </StrictMode>,
)
