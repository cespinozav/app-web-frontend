import { Controller } from 'react-hook-form'

export default function FormInput({ control, name, rules, ...inputProps }) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <>
          <input {...field} {...inputProps} />
          {fieldState.error && <span style={{ color: 'red', fontSize: 12 }}>{fieldState.error.message}</span>}
        </>
      )}
    />
  )
}
