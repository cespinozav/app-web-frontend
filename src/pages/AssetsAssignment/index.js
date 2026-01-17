import { useEffect, useState } from 'react'
import useAssetsAssignment from 'hooks/useAssetsAssignment'
import { Button } from 'primereact/button'
import Binnacle from './components/Binnacle'
import AssetsDetails from './components/AssetsDetails'
import AssetsList from './components/AssetsList'
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
      <AssetsDetails
        assignment={assignmentRow}
        updateAssignment={updateAssignment}
        isLoading={isLoading}
      />
    </>
  )
}

const AssetAssignment = () => {
  const {
    assignments,
    searchAssignments,
    isLoading,
    updateAssignment,
    clearAssignments,
    pageHandling,
  } = useAssetsAssignment()
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
    <div className="asset">
      <SearchForm
        isLoading={isLoading}
        searchLicenses={(formData) => {
          searchAssignments(formData, 0)
          setView(VIEWS.LIST)
        }}
        clearAssets={timeout => {
          clearAssignments(timeout)
          backToList()
        }}
      />
      <div className="section">
        {view === VIEWS.LIST ? (
          <AssetsList
            assignments={assignments}
            isLoading={isLoading}
            onDetails={(id) => {
              setView(VIEWS.DETAILS)
              setSelectedAssignment(assignments.find((a) => a.id === id))
            }}
            pageHandling={pageHandling}
            updateAssignment={updateAssignment}
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
export default AssetAssignment
