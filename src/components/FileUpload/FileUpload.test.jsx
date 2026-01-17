import { render, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FileUploadInput from '.'

const MAX_FILES = 3

describe('FileUpload render test', () => {
  it('should render a button', () => {
    const component = render(
      <FileUploadInput
        onChange={() => {}}
        onUpload={() => {}}
        value={[]}
        maxFiles={MAX_FILES}
        className={''}
        formats={['jpeg']}
      />
    )
    const button = component.getByRole('button')
    expect(button).toBeDefined()
  })
  // it('should add a file', async () => {
  //   const filename = 'chucknorris.png'
  //   const fakeFile = new File(['(⌐□_□)'], filename, { type: 'image/png' })
  //   const component = render(
  //     <FileUploadInput
  //       onChange={() => {}}
  //       onUpload={() => {}}
  //       value={[]}
  //       maxFiles={MAX_FILES}
  //       className={''}
  //       formats={['jpeg']}
  //     />
  //   )
  //   const uploader = component.getByTestId('file-input')
  //   await waitFor(() =>
  //     fireEvent.change(uploader, {
  //       target: { files: [fakeFile] }
  //     })
  //   )
  //   expect(uploader.files[0].name).toBe(filename)
  //   expect(uploader.files.length).toBe(1)
  // })
  it('should add a file', async () => {
    const filename = 'chucknorris.png'
    const fakeFile = new File(['(⌐□_□)'], filename, { type: 'image/png' })
    let value = []
    const { findByTestId } = render(
      <FileUploadInput
        onChange={newValue => {
          value = newValue
        }}
        maxFiles={MAX_FILES}
        formats={['.jpg', '.jpeg', '.png']}
      />
    )

    const uploader = findByTestId('file-input')
    // await waitFor(() =>
    //   fireEvent.change(uploader, {
    //     target: { files: [fakeFile] }
    //   })
    // )
    await userEvent.upload(uploader, [fakeFile])
    expect(uploader.files[0].name).toBe(filename)
    expect(uploader.files.length).toBe(1)
  })

  // it('should show new file on list', async () => {
  //   const component = render(
  //     <FileUploadInput
  //       onChange={() => {}}
  //       onUpload={() => {}}
  //       value={[]}
  //       maxFiles={MAX_FILES}
  //       className={''}
  //       formats={['.pdf']}
  //     />
  //   )
  //   const uploader = component.getByTestId('file-input')
  //   const list = component.getb
  //   const filename = 'chucknorris'
  //   const fakeFiles = Array.from({ length: 3 }).map(
  //     (_, i) => new File([`(⌐□_□)${i}`], `${filename}${i}.png`, { type: 'image/png' })
  //   )
  //   await waitFor(() =>
  //     fireEvent.change(uploader, {
  //       target: { files: fakeFiles }
  //     })
  //   )
  //   expect(uploader.files.length).toBe(1)
  // })
})
