import { useQuery } from 'hooks/useRequest'
import { Paginator } from 'primereact/paginator'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState } from 'react'
import ModalForm from './ModalForm'

const PAGE_SIZE = 10
const MODAL = {
  NONE: 0,
  EDIT: 1,
}

export default function Table({ option }) {
  const { FormComponent, service } = option
  const [page, setPage] = useState(1)
  const { data: queryData, isFetching } = useQuery([service.id, page], () => option.request({ page, page_size: PAGE_SIZE }))
  const data = queryData?.results || []
  const totalRecords = queryData?.count || 0
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [rowData, setRowData] = useState(null)

  const onClose = () => {
    setShowModal(MODAL.NONE)
    setRowData(null)
  }

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
          <DataTable value={data} paginator={false} rows={PAGE_SIZE} responsiveLayout="scroll" className="p-datatable-sm">
            {option.schema.map(col => (
              <Column key={col.field} field={col.field} header={col.label} />
            ))}
            <Column
              body={row => (
                <div className="actions">
                  <Button
                    icon="pi pi-pencil"
                    className="p-button-text p-button-sm"
                    onClick={() => {
                      setRowData(row)
                      setShowModal(MODAL.EDIT)
                    }}
                    tooltip="Editar"
                  />
                </div>
              )}
              header="Acciones"
              style={{ width: 60 }}
            />
          </DataTable>
          <div className="paginate">
            <Paginator
              first={(page - 1) * PAGE_SIZE}
              rows={PAGE_SIZE}
              totalRecords={totalRecords}
              onPageChange={e => setPage(e.page + 1)}
              template="PrevPageLink PageLinks NextPageLink"
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
