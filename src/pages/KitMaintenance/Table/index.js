import { useQuery } from 'hooks/useRequest'
import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import { Skeleton } from 'primereact/skeleton'
import { useEffect, useState } from 'react'
import ModalForm from './ModalForm'
import DeleteModal from './DeleteModal'

const PAGE_SIZE = 10
const MODAL = {
  NONE: 0,
  EDIT: 1,
  DELETE: 2
}

export default function Table({ option }) {
  const { FormComponent, service } = option
  const { data: queryData, isFetching } = useQuery([service.id], option.request)
  const data = queryData || []
  const [firstRow, setFirstRow] = useState(0)
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const [rowData, setRowData] = useState(null)

  const onClose = () => {
    setShowModal(MODAL.NONE)
    setRowData(null)
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
            postDelete={() => {
              setRowData(null)
              setShowModal(MODAL.NONE)
            }}
            rowId={rowData?.id}
          />
          <DataTable
            emptyMessage="No hay resultados"
            className="table"
            value={data.slice(firstRow, firstRow + PAGE_SIZE)}
            responsiveLayout="stack"
            breakpoint="760px"
            dataKey="id"
          >
            {option.schema.map((row, index) => (
              <Column field={row.field} header={row.label} key={index}></Column>
            ))}
            {data.length > 0 && (
              <Column
                header="Acción"
                body={row => (
                  <div className="actions">
                    <Button
                      icon="pi pi-pencil"
                      iconPos="right"
                      onClick={() => {
                        setRowData(row)
                        setShowModal(MODAL.EDIT)
                      }}
                    />
                    <Button
                      icon="pi pi-trash"
                      iconPos="right"
                      onClick={() => {
                        setRowData(row)
                        setShowModal(MODAL.DELETE)
                      }}
                    />
                  </div>
                )}
              />
            )}
          </DataTable>
          <div className="paginate">
            <Paginator
              first={firstRow}
              rows={PAGE_SIZE}
              onPageChange={e => setFirstRow(e.first)}
              totalRecords={data.length}
            ></Paginator>
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
