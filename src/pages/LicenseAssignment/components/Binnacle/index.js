import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import FILES from 'assets/img/icons/files.svg'
import React, { useState } from 'react'
import { Skeleton } from 'primereact/skeleton'
import { LicenseService } from 'services'
import { Dialog } from 'primereact/dialog'
import useBinnacle from 'hooks/useBinnacle'
import { BinnacleDetailModal, DocumentsDetailModal } from '../Modals'

const PAGE_SIZE = 10
const MODAL = {
  COMMENT: 'comment',
  FILES: 'files',
  DETAIL: 'details',
  NONE: 'none'
}

export default function Binnacle({ assignId }) {
  const [showModal, setShowModal] = useState(MODAL.NONE)
  const closeModal = () => {
    setShowModal(MODAL.NONE)
  }
  const [rowData, setRowData] = useState(null)
  const [binnacle, pageHandling] = useBinnacle(assignId, LicenseService.binnacle)
  const { firstRow, rowCount, onPageChange } = pageHandling
  return (
    <div className="kit-list binnacle">
      {binnacle
        ? binnacle.length === 0 && (
            <div className="empty">
              <img src={FILES} alt="files" />
              <span>No hay registros de bitácora.</span>
            </div>
          )
        : Array.from({ length: PAGE_SIZE }).map((_, key) => <Skeleton className="table" key={key}></Skeleton>)}
      {binnacle && binnacle.length > 0 && (
        <>
          <Dialog className="dialog" visible={showModal === MODAL.COMMENT} draggable={false} modal onHide={closeModal}>
            <h2 className="header">Comentario de idBit {rowData?.id}</h2>
            <p className="comment">{rowData?.comments}</p>
          </Dialog>
          <BinnacleDetailModal onClose={closeModal} isVisible={showModal === MODAL.DETAIL} assignment={rowData} />
          <DocumentsDetailModal onClose={closeModal} isVisible={showModal === MODAL.FILES} assignment={rowData} />
          <DataTable className="table" value={binnacle} responsiveLayout="stack" breakpoint="760px" dataKey="id">
            <Column field="id" header="IdBit:"></Column>
            <Column field="created" header="FECHA:"></Column>
            <Column field="classificationName" header="CLASIFICACIÓN:"></Column>
            <Column field="authorName" header="AUTORIZADOR:"></Column>
            <Column field="method" header="MEDIO:"></Column>
            <Column field="country" header="PAÍS:"></Column>
            <Column field="reference" header="REFERENCIA:"></Column>
            <Column field="user" header="USUARIO:"></Column>
            <Column
              header="ACCIÓN:"
              body={row => {
                const docLength = row?.documents?.length
                const disabled = !docLength || (docLength && docLength === 0)
                return (
                  <div className="actions">
                    <Button
                      icon="pi pi-comment"
                      iconPos="right"
                      disabled={!row?.comments}
                      onClick={() => {
                        setShowModal(MODAL.COMMENT)
                        setRowData(row)
                      }}
                    />
                    <Button
                      icon="pi pi-paperclip"
                      iconPos="right"
                      disabled={disabled}
                      color="red"
                      onClick={() => {
                        setShowModal(MODAL.FILES)
                        setRowData(row)
                      }}
                    />
                    <Button
                      icon="pi pi-eye"
                      iconPos="right"
                      onClick={() => {
                        setShowModal(MODAL.DETAIL)
                        setRowData(row)
                      }}
                    />
                  </div>
                )
              }}
            ></Column>
          </DataTable>
          <Paginator
            first={firstRow}
            rows={10}
            onPageChange={onPageChange}
            // onPageChange={e => setFirstRow(e.first)}
            totalRecords={rowCount}
          ></Paginator>
        </>
      )}
    </div>
  )
}
