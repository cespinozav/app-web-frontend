import { useController } from 'react-hook-form'
import FileUploadInput from 'components/FileUpload'
import { MAX_FILES } from 'utils/constants'

function FormFileDrop({ name, control, rules, formats, onUpload, onError, maxFiles, message }) {
  const { field, fieldState } = useController({
    name,
    control,
    rules
  })
  return (
    <FileUploadInput
      onChange={field.onChange}
      value={field.value}
      maxFiles={maxFiles || MAX_FILES}
      className={fieldState.error ? 'p-invalid' : ''}
      formats={formats}
      onUpload={onUpload}
      message={message}
      onError={onError}
    />
  )
}

export default FormFileDrop
