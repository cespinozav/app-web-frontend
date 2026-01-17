import React from 'react'

export default function Checkbox({ disabled = false, checked = false, onChange }) {
  return (
    <label className="checkbox">
      <input type="checkbox" disabled={disabled} checked={checked} onChange={onChange} />
      <span className="checkmark"></span>
    </label>
  )
}
