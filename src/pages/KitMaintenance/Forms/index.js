import { Dialog } from 'primereact/dialog'

export { default as BrandsForm } from './Brands'
export { default as TypeServiceForm } from './TypeService'
export { default as OperatorForm } from './Operators'
export { default as PlansForm } from './Plans'
export { default as AdditionalForm } from './Additional'
export { default as ModelsForm } from './Models'
export { default as SeatForm } from './Seat'
export { default as ClassificationForm } from './Classification'
export { default as ContractForm } from './Contract'

export function ModalForm({ isVisible, onClose, children }) {
  const close = () => {
    onClose()
  }
  return (
    <Dialog className="dialog licenses-dialog maintenance" draggable={false} visible={isVisible} modal onHide={close}>
      {children}
    </Dialog>
  )
}
