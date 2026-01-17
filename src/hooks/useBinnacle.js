import { useState } from 'react'
import { formatDate } from 'utils/dates'
import useToast from 'hooks/useToast'
import { LICENSE_BINNACLE } from 'utils/constants'
import { useQuery } from './useRequest'

const PAGE_SIZE = 10

function formatBinnacle(fetchData, noBinnacle) {
  if (noBinnacle) return {}
  const { rowCount, data } = fetchData || {}
  const binnacle =
    data?.map(d => ({
      ...d,
      created: formatDate(d.created),
      method: LICENSE_BINNACLE.METHODS.find(m => d.method === m.value)?.label || d.method
    })) || []
  return { rowCount, binnacle }
}

export default function useBinnacle(assignId, service) {
  const toast = useToast()
  const [firstRow, setFirstRow] = useState(0)
  const { data, isLoading, isError } = useQuery(
    [service.id, { firstRow, assignId }],
    ({ signal }) => service.get({ signal, assignId, page: Math.floor(firstRow / PAGE_SIZE) }),
    {
      onSuccess: res => {
        if (res.length === 0) toast.warn('No hay registros con los parámetros ingresados')
      },
      onError: err => {
        console.log(err)
        toast.error('No se pudo cargar la bitácora')
      }
    }
  )
  const { rowCount, binnacle } = formatBinnacle(data, isError || isLoading)

  const searchBinnacle = page => {
    setFirstRow(page * PAGE_SIZE)
  }
  const onPageChange = e => {
    const { page, first } = e
    searchBinnacle(page)
    setFirstRow(first)
  }

  const pageHandling = { firstRow, rowCount, onPageChange }
  return [binnacle, pageHandling]
}
