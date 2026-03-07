import React from 'react';
import styles from './CartTable.module.scss';

export default function CartStepper({ value, min = 1, max, onChange }) {
  return (
    <div className={styles['cart-stepper']}>
      <button
        type="button"
        className={styles['cart-stepper-btn']}
        aria-label="Restar"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        -
      </button>
      <span className={styles['cart-stepper-value']}>{value}</span>
      <button
        type="button"
        className={styles['cart-stepper-btn']}
        aria-label="Sumar"
        onClick={() => onChange(max ? Math.min(max, value + 1) : value + 1)}
        disabled={max !== undefined && value >= max}
      >
        +
      </button>
    </div>
  );
}
