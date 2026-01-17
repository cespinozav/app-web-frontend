import Select from 'react-select'

const ModalSelect = ({ title, isShowing, primaryAction, close, data }) =>
  isShowing ? (
    <div className="modalSelect">
      <div>
        <div className="box">
          <button className="close" type="button" onClick={close}>
            X
          </button>
        </div>
        <h1>{title}</h1>
        <div className="container">
          <Select options={data} onChange={op => primaryAction(op)} />
        </div>
      </div>
    </div>
  ) : null

export default ModalSelect
