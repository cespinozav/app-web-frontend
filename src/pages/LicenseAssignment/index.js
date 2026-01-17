import useLicenseAssignment from 'hooks/useLicenseAssignment'
import { Button } from 'primereact/button'
import { useEffect, useState } from 'react'
import Binnacle from './components/Binnacle'
import LicenseDetails from './components/LicenseDetails'
import LicenseList from './components/LicenseList'
import ResponsibleDetails from './components/ResponsibleDetails'
import SearchForm from './components/SearchForm'

const VIEWS = {
  DETAILS: 0,
  BINNACLE: 1,
  LIST: 2,
}

function LicensingDetails({ assignmentRow, updateAssignment, isLoading }) {
  return (
    <>
      <ResponsibleDetails assignment={assignmentRow} />
      <LicenseDetails
        assignment={assignmentRow}
        updateAssignment={updateAssignment}
        isLoading={isLoading}
      />
    </>
  )
}

const LicenseAssignment = () => {
  const {
    assignments,
    searchAssignments,
    isLoading,
    updateAssignment,
    pageHandling,
    clearAssigments,
  } = useLicenseAssignment()
  const [view, setView] = useState(VIEWS.LIST)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const backToList = () => {
    setView(VIEWS.LIST)
    setSelectedAssignment(null)
  }
  useEffect(() => {
    if (selectedAssignment) {
      setSelectedAssignment((s) => assignments.find((a) => a.id === s.id))
    }
  }, [assignments])
  return (
    <div className="license">
      <SearchForm
        isLoading={isLoading}
        searchLicenses={(formData) => {
          searchAssignments(formData, 0)
          setView(VIEWS.LIST)
        }}
        clearLicenses={() => {
          clearAssigments()
          backToList()
        }}
      />
      <div className="section">
        {view === VIEWS.LIST ? (
          <LicenseList
            assignments={assignments}
            isLoading={isLoading}
            onDetails={(id) => {
              setView(VIEWS.DETAILS)
              setSelectedAssignment(assignments.find((a) => a.id === id))
            }}
            updateAssignment={updateAssignment}
            pageHandling={pageHandling}
          />
        ) : (
          <>
            <div className="header title">
              <button
                className={view === VIEWS.DETAILS ? 'active' : ''}
                onClick={() => setView(VIEWS.DETAILS)}
              >
                DETALLE DEL RESPONSABLE
              </button>
              <button
                className={view === VIEWS.BINNACLE ? 'active' : ''}
                onClick={() => setView(VIEWS.BINNACLE)}
              >
                BITACORA DE MOVIMIENTO
              </button>
              <Button
                onClick={backToList}
                icon="pi pi-arrow-circle-left"
                label="Atrás"
              />
            </div>
            <div className="content">
              {view === VIEWS.DETAILS && selectedAssignment && (
                <LicensingDetails
                  assignmentRow={selectedAssignment}
                  updateAssignment={updateAssignment}
                  isLoading={isLoading}
                />
              )}
              {view === VIEWS.BINNACLE && (
                <Binnacle assignId={selectedAssignment.id} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
export default LicenseAssignment
