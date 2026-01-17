import { MultiSelect } from 'primereact/multiselect'

function MultiSelectStyled(props) {
  return <MultiSelect {...props} display="chip" className={props.className || 'multiselect'} />
}

export default MultiSelectStyled
