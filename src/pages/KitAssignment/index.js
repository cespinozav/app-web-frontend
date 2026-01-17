import { useEffect, useState } from 'react'
import useKitAssignment from 'hooks/useKitAssignment'
import { Button } from 'primereact/button'
import Binnacle from './components/Binnacle'
import DeviceDetails from './components/DeviceDetails'
import KitList from './components/KitList'
import ResponsibleDetails from './components/ResponsibleDetails'
import SearchForm from './components/SearchForm'

const VIEWS = {
  DETAILS: 0,
  BINNACLE: 1,
  LIST: 2,
}

function Details({ assignmentRow, updateAssignment, isLoading }) {
  return (
    <>
      <ResponsibleDetails
        assignment={assignmentRow}
        updateAssignment={updateAssignment}
        isLoading={isLoading}
      />
      <DeviceDetails
        assignment={assignmentRow}
        updateAssignment={updateAssignment}
        isLoading={isLoading}
      />
    </>
  )
}

const KitAssignment = () => {
  const {
    assignments,
    searchAssignments,
    isLoading,
    updateAssignment,
    clearAssignments,
    pageHandling,
  } = useKitAssignment()
  const [view, setView] = useState(VIEWS.LIST)
  const [selectedAssignment, setSelectedAssignment] = useState(null)
  const backToList = () => {
    setView(VIEWS.LIST)
    setSelectedAssignment(null)
  }
  useEffect(() => {
    if (selectedAssignment) {
      setSelectedAssignment(s => assignments.find(a => a.id === s.id) ?? null)
    }
  }, [assignments])
  return (
    <div className="device-assignment">
      <SearchForm
        isLoading={isLoading}
        searchKits={(formData) => {
          searchAssignments(formData, 0)
          setView(VIEWS.LIST)
        }}
        clearKits={(timeout) =>{
          clearAssignments(timeout)
          backToList()
        }}
      />
      <div className="section">
        {view === VIEWS.LIST ? (
          <KitList
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
                <Details
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
export default KitAssignment
