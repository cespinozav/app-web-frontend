import React from 'react'

export default function Steps({ activeIndex, labels, onStepClick }) {
  return (
    <nav className="steps">
      {labels.map((label, idx) => (
        <button
          className={`step ${activeIndex === idx ? 'active' : ''}`}
          key={idx}
          type="button"
          onClick={() => {
            if (onStepClick) {
              onStepClick(idx)
            }
          }}
        >
          <div>{idx + 1}</div>
          <div>{label}</div>
        </button>
      ))}
    </nav>
  )
}
