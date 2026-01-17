const ModalMobileSelect = ({ title, isShowing, primaryAction, data }) =>
  isShowing ? (
    <div className="modalMobileSelect">
      <div>
        <h1>{title}</h1>
        <div className="numbers-container">
          {data.map((item, index) => (
            <button key={item} onClick={() => primaryAction(index)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null
export default ModalMobileSelect
