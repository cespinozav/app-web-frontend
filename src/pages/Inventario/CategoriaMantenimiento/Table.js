import { useQuery } from 'hooks/useRequest'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
// ...existing code...
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState } from 'react'
import ModalForm from './ModalForm'
// import DeleteModal from './DeleteModal'
import { Paginator } from 'primereact/paginator'

const PAGE_SIZE = 10
const MODAL = {
  NONE: 0,
  EDIT: 1,
  // DELETE: 2
}

export default function Table({ option }) {
  const { FormComponent, service } = option
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10
  const { data: queryData, isFetching } = useQuery([service.id, page], () => option.request({ page, page_size: PAGE_SIZE }))
  const data = queryData?.results || []
  const totalRecords = queryData?.count || 0
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [rowData, setRowData] = useState(null)

  const onClose = () => {
    setShowModal(MODAL.NONE)
    setRowData(null)
  }
  // const postDelete = () => {
  //   setRowData(null)
  //   setShowModal(MODAL.NONE)
  // }

  useEffect(() => {
    setRowData(null)
    setPage(1)
  }, [option])

  return (
    <div className="kit-list maintenance">
      {isFetching ? (
        Array.from({ length: PAGE_SIZE }).map((_, key) => <Skeleton className="table" key={key}></Skeleton>)
      ) : (
        <>
          <ModalForm
            isVisible={showModal === MODAL.EDIT}
            onClose={onClose}
            defaultFields={rowData}
            serviceKey={option.title}
            service={service}
            FormComponent={FormComponent}
          />
          {/* Eliminar modal de eliminación */}
          <DataTable value={data} className="table" emptyMessage="No hay resultados">
            <Column field="id" header="ID" />
            <Column field="description" header="Nombre" />
            <Column field="user_created" header="Creador" />
            <Column field="date_created" header="Fecha Creación" />
            <Column
              header="Acción"
              body={row => (
                <div className="actions">
                  <Button icon="pi pi-pencil" className="p-button p-component p-button-icon-only" style={{ background: 'transparent' }} onClick={() => { setRowData(row); setShowModal(MODAL.EDIT) }} aria-label="Editar" />
                </div>
              )}
            />
          </DataTable>
          <div className="paginate">
            <Paginator
              first={(page - 1) * PAGE_SIZE}
              rows={PAGE_SIZE}
              onPageChange={e => setPage(Math.floor(e.first / PAGE_SIZE) + 1)}
              totalRecords={totalRecords}
            />
            <div className="buttons">
              <button
                onClick={() => {
                  setRowData(null)
                  setShowModal(MODAL.EDIT)
                }}
                className="add"
              >
                Agregar +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
