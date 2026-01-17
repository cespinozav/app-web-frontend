import React, { useState } from 'react'
import { AutoComplete } from 'primereact/autocomplete'

function AutoCompleteStyled({ request, value, setValue, name, minLength, ...props }) {
  const [suggestions, setSuggestions] = useState(null)
  const searchValue = event => {
    request(event.query).then(auxSuggestions => setSuggestions(auxSuggestions))
  }
  return (
    <AutoComplete
      {...props}
      inputId={props.id || name}
      minLength={minLength || 3}
      value={value}
      suggestions={suggestions}
      completeMethod={searchValue}
      delay={1000}
      onChange={e => setValue(e.value)}
      aria-label={name}
    />
  )
}

export default AutoCompleteStyled
