import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { FILE_FORMATS, MAX_MB_SIZE } from 'utils/constants'
import { ERRORS_MSG } from 'utils/exceptions'
import { getFileformatIcon } from 'utils/misc'
import FileDropArea from './FileDropArea'

const MAX_FILE_SIZE = MAX_MB_SIZE * 1000 * 1000

function getfileMessage(totalKBytes) {
  if (totalKBytes < 1000) {
    return `${Math.max(Math.round(totalKBytes), 1)} KB`
  }
  if (totalKBytes < MAX_MB_SIZE * 1000) {
    return `${Math.round((totalKBytes / 1000) * 10) / 10} MB`
  }
  return `Sobrepasa los ${MAX_MB_SIZE}MB`
}

function FileUploadInput({ onChange, value, maxFiles = 1, formats, message, className, onUpload, onError }) {
  const [isLoading, setIsLoading] = useState(false)
  const totalKBytes = value.map(v => v?.size).reduce((acc, curr) => acc + curr, 0) / 1000
  const appendFiles = async newFiles => {
    const newFile = newFiles[0]
    if (value.map(v => v.name).includes(newFile.name)) {
      onError(ERRORS_MSG.SAME_FILE)
      return
    }
    if (newFile.size + totalKBytes * 1000 > MAX_FILE_SIZE) {
      if (onError) {
        onError(getfileMessage(newFile.size / 1000))
      }
      return
    }
    if (value.length < maxFiles) {
      if (onUpload) {
        setIsLoading(true)
        try {
          const result = await onUpload(newFile)
          onChange([...value, { ...result, size: newFile.size, name: newFile.name }])
        } catch (err) {
          if (onError) {
            onError(err)
          }
        }
        setIsLoading(false)
      } else {
        onChange([...value, newFile])
      }
    } else if (onError) {
      onError(ERRORS_MSG.MAX_FILE_SIZE)
    }
  }
  const removeFile = deleteIdx => {
    onChange(value.filter((_, idx) => idx !== deleteIdx))
  }
  const extensions = formats.flat().map(format => (typeof format === 'object' ? format.extension : format))
  const flatFormats = extensions.join(' ')

  const accepts = formats.flat().map(format => (typeof format === 'object' ? format.accept : format))
  return (
    <div className={`file-upload ${className}`}>
      <FileDropArea
        onDrop={appendFiles}
        formats={accepts || [FILE_FORMATS.PDF, FILE_FORMATS.IMAGE]}
        validExtensions={extensions}
        isLoading={isLoading}
        label={isLoading ? 'Subiendo documento...' : message ?? 'Subir documento'}
      />
      {value.length > 0 ? (
        <div className="list">
          {value.map((file, idx) => (
            <div className="info" key={idx}>
              <i className={`pi ${getFileformatIcon(file.name)}`}></i>
              <p>{file.name}</p>
              <Button icon="pi pi-times-circle" className="delete" type="button" onClick={() => removeFile(idx)} />
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>{`Extensiones válidas: ${flatFormats}`}</p>
          <p>{`Máximo de ${maxFiles} archivos`}</p>
        </div>
      )}
      {totalKBytes > 0 && <p className="total">Total: {getfileMessage(totalKBytes)}</p>}
    </div>
  )
}

export default FileUploadInput
