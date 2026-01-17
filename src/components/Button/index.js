import LOADING from 'assets/img/loading.svg'

const Button = ({ onClick, text, className, isLoading = false, icon, type }) => (
  <div className="button">
    <button onClick={onClick} className={className} type={type} disabled={isLoading}>
      {!isLoading ? (
        <>
          <span>{text}</span>
          {icon && <img src={icon} alt="save" />}
        </>
      ) : (
        <div>
          <img src={LOADING} alt="loading-icon" />
        </div>
      )}
    </button>
  </div>
)

export default Button
