import { useState } from 'react'
import BinnacleReport from './BinnacleReport'
import AssignmentReport from './AssignmentReport'

export default function LicenseReport() {
  const [showFilterReport, setShowFilterReport] = useState(true)
  return (
    <div className="device-maintenance">
      <div className="header">
        <button onClick={() => setShowFilterReport(true)} className={showFilterReport ? 'active' : ''}>
          REPORTE POR ASIGNACIÓN
        </button>
        <button onClick={() => setShowFilterReport(false)} className={showFilterReport ? '' : 'active'}>
          REPORTE POR BITÁCORA
        </button>
      </div>
      {showFilterReport ? <AssignmentReport /> : <BinnacleReport />}
    </div>
  )
}
