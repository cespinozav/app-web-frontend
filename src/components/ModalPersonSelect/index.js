const ModalPersonSelect = ({ title, isShowing, primaryAction, data }) =>
  isShowing ? (
    <div className="modalPersonSelect">
      <div>
        <h1>{title}</h1>
        <div className="persons-container">
          {data.map((item, index) => (
            <button key={item.id} onClick={() => primaryAction(index)}>
              {`${item.names} ${item.lastname_p} ${item.lastname_m} - asignado a: ${
                item.binnacle[0] ? item.binnacle[0].assign_to : '-'
              }`}
            </button>
          ))}
        </div>
      </div>
    </div>
  ) : null
export default ModalPersonSelect
