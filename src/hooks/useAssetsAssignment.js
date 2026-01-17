import { useRef, useState } from 'react'
import { AssetService } from 'services'
import useToast from './useToast'

const useAssetAssignment = () => {
  const [assignments, setAssignments] = useState([])
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [firstRow, setFirstRow] = useState(0)
  const [rowCount, setRowCount] = useState(0)
  const paramsRef = useRef({})

  const searchAssignments = formData => {
    setIsLoading(true)
    const { page } = formData
    paramsRef.current = formData
    AssetService.assignments
      .get(formData)
      .then(res => {
        if (!page || page === 0) {
          setFirstRow(0)
        }
        setRowCount(res.rowCount ?? 0)
        const rows = res.data
        if (rows.length === 0) {
          toast.warn('No hay registros con los parámetros ingresados')
        }
        setAssignments(rows)
      })
      .catch(e => {
        toast.error(String(e))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const onPageChange = e => {
    const { page, first } = e
    const newParams = { ...paramsRef.current, page }
    searchAssignments(newParams)
    setFirstRow(first)
  }
  const updateAssignment = () => {
    searchAssignments(paramsRef.current)
  }
  const clearAssignments = (timeout = 500) => {
    if (timeout) {
      setIsLoading(true)
      setTimeout(() => {
        setAssignments([])
        setIsLoading(false)
      }, timeout)
    } else {
      setAssignments([])
    }
  }
  const pageHandling = { firstRow, rowCount, onPageChange }
  return {
    assignments,
    updateAssignment,
    searchAssignments,
    clearAssignments,
    pageHandling,
    isLoading
  }
}
export default useAssetAssignment
