import { useQuery } from 'hooks/useRequest'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
// ...existing code...
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState } from 'react'
import ModalForm from './ModalForm'
import DeleteModal from './DeleteModal'
import { Paginator } from 'primereact/paginator'

const PAGE_SIZE = 10
const MODAL = {
  NONE: 0,
  EDIT: 1,
  DELETE: 2
}

export default function Table({ option }) {
  const { FormComponent, service } = option
  const { data: queryData, isFetching } = useQuery([service.id], option.request)
  const data = Array.isArray(queryData) ? queryData : []
  const [firstRow, setFirstRow] = useState(0)
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [rowData, setRowData] = useState(null)

  const onClose = () => {
    setShowModal(MODAL.NONE)
    setRowData(null)
  }
  const postDelete = () => {
    setRowData(null)
    setShowModal(MODAL.NONE)
  }

  useEffect(() => {
    setRowData(null)
    return () => {
      setFirstRow(0)
    }
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
          <DeleteModal
            onClose={onClose}
            isVisible={showModal === MODAL.DELETE && rowData?.id}
            service={service}
            postDelete={postDelete}
            rowId={rowData?.id}
          />
          <DataTable value={data.slice(firstRow, firstRow + PAGE_SIZE)} className="table" emptyMessage="No hay resultados">
            <Column field="id" header="ID" />
            <Column field="description" header="Nombre" />
            <Column field="user_created" header="Creador" />
            <Column field="date_created" header="Fecha Creación" />
            <Column
              header="Acción"
              body={row => (
                <div className="actions">
                  <Button icon="pi pi-pencil" className="p-button p-component p-button-icon-only" onClick={() => { setRowData(row); setShowModal(MODAL.EDIT) }} />
                  <Button icon="pi pi-trash" className="p-button p-component p-button-icon-only" onClick={() => { setRowData(row); setShowModal(MODAL.DELETE) }} />
                </div>
              )}
            />
          </DataTable>
          <div className="paginate">
            <Paginator
              first={firstRow}
              rows={PAGE_SIZE}
              onPageChange={e => setFirstRow(e.first)}
              totalRecords={data.length}
            />
            <div className="buttons">
              <button
                onClick={() => {
                  setRowData(null)
                  setShowModal(MODAL.EDIT)
                }}
                className="add"
              >
                Agregar categoría +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
