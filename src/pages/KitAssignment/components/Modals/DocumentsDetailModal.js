import { Dialog } from 'primereact/dialog'
import { getFileformatIcon } from 'utils/misc'

export default function DocumentsDetailModal({ assignment, isVisible, onClose }) {
  return (
    <Dialog className="dialog" visible={isVisible} draggable={false} modal onHide={onClose}>
      <h2 className="header">Documentos de idBit {assignment?.id}</h2>
      <ul className="files">
        {assignment?.documents?.map((document, idx) => {
          const docType = getFileformatIcon(document.name)
          return (
            <li key={`file-${idx}`}>
              <i className={`pi ${docType}`}></i>
              <a target="_blank" href={document.url} rel="noreferrer">
                {document.name}
              </a>
            </li>
          )
        })}
      </ul>
    </Dialog>
  )
}
