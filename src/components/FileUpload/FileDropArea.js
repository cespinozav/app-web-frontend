import { Button } from 'primereact/button'
import React, { useRef } from 'react'

function FileDropArea({ children, onDrop, formats, validExtensions, isLoading, label }) {
  const fileInputRef = useRef(null)

  const extensions = formats.flat()

  function isValidFile(file) {
    return (validExtensions || extensions).filter(extension => file.name.toLowerCase().endsWith(extension)).length > 0
  }
  const sendFiles = files => {
    onDrop(files.filter(isValidFile))
  }
  // const processFilesAndSend = ev => {
  //   ev.preventDefault()
  //   ev.stopPropagation()
  //   const ret = []
  //   if (ev.dataTransfer.items) {
  //     for (let i = 0; i < ev.dataTransfer.items.length; i += 1) {
  //       if (ev.dataTransfer.items[i].kind === 'file') {
  //         const file = ev.dataTransfer.items[i].getAsFile()
  //         ret.push(file)
  //       }
  //     }
  //   } else {
  //     for (let j = 0; j < ev.dataTransfer.files.length; j += 1) {
  //       ret.push(ev.dataTransfer.files[j])
  //     }
  //   }
  //   sendFiles(ret)
  // }

  const onFileChange = event => {
    sendFiles([...event.target.files])
    fileInputRef.current.value = ''
  }
  return (
    <Button
      className="area"
      loading={isLoading}
      type="button"
      label={label}
      icon="pi pi-paperclip"
      iconPos="right"
      onDragOver={e => e.preventDefault()}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        ref={fileInputRef}
        accept={extensions ? extensions.join(',') : ''}
        style={{ display: 'none' }}
        type="file"
        data-testid="file-input"
        onChange={onFileChange}
        // multiple={true}
      />
      {children}
    </Button>
  )
}

export default FileDropArea
