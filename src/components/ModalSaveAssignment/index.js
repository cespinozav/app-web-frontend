import { useState } from 'react'

const Modal = ({ isShowing, title, subtitle, firstLabel, secondLabel, primaryAction, secondaryAction }) => {
  const [modalData, setModalData] = useState({ ticket: '', comment: '' })

  return isShowing ? (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <div className="title">{title && <h1>{title}</h1>}</div>
          <div className="subtitle">{subtitle && <p>{subtitle}</p>}</div>
        </div>

        <div className="modal-body">
          <div>
            <label htmlFor="firstValue">{firstLabel}</label>
            <input
              value={modalData.firstValue}
              onChange={e => setModalData({ ...modalData, firstValue: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="secondValue">{secondLabel}</label>
            <input
              value={modalData.secondValue}
              onChange={e => setModalData({ ...modalData, secondValue: e.target.value })}
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="first-action"
            onClick={() => {
              primaryAction(modalData)
              setModalData({
                ticket: '',
                comment: ''
              })
              secondaryAction()
            }}
          >
            ACEPTAR
          </button>
          <button
            className="second-action"
            onClick={() => {
              setModalData({
                ticket: '',
                comment: ''
              })
              secondaryAction()
            }}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  ) : null
}
export default Modal
