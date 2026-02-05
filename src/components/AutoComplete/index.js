import React, { useState } from 'react'
import { AutoComplete } from 'primereact/autocomplete'

function AutoCompleteStyled({ request, value, setValue, name, minLength, ...props }) {
  const [suggestions, setSuggestions] = useState([])
  const searchValue = event => {
    request(event.query).then(auxSuggestions => setSuggestions(Array.isArray(auxSuggestions) ? auxSuggestions : []))
  }

  // Normaliza el valor para mostrar correctamente en el input
  let normalizedValue = value;
  if (value == null) {
    normalizedValue = null;
  } else if (typeof value === 'number') {
    // Si el valor es un id, busca el objeto en las sugerencias
    normalizedValue = suggestions.find(s => s.id === value) || null;
  } else if (typeof value === 'object' && value !== null) {
    // Si el objeto no tiene description, usa nombre
    if (!('description' in value) && 'nombre' in value) {
      normalizedValue = { ...value, description: value.nombre };
    }
  }

  return (
    <AutoComplete
      {...props}
      inputId={props.id || name}
      minLength={minLength || 3}
      value={normalizedValue}
      suggestions={Array.isArray(suggestions) ? suggestions : []}
      completeMethod={searchValue}
      field="description"
      delay={1000}
      onChange={e => setValue(e.value)}
      aria-label={name}
    />
  )
}

export default AutoCompleteStyled
