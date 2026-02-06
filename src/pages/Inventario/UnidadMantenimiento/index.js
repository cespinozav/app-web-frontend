import options from './service'
import UnidadTable from './UnidadTable'
import './style.scss'

export default function UnidadMantenimiento() {
  return <UnidadTable option={options[0]} />
}
