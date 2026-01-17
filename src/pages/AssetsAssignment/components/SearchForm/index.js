import { Button } from 'primereact/button'
import { ACCOUNT_TYPES } from 'utils/constants'
import { useForm } from 'react-hook-form'
import {
  FormCalendar,
  FormAutoComplete,
  FormMultiSelect,
  FormDropdown,
} from 'components/FormControls'
import { useUrlParams } from 'hooks/useUrlParams'
import { formatSearchDate, parseToDate } from 'utils/dates'
import { useEffect, useState } from 'react'
import { AssetService, PersonService } from 'services'
import useToast from 'hooks/useToast'
import { multiFetch } from 'utils/network'
import { useQueryClient } from '@tanstack/react-query'
import { ERROR_TAGS } from 'utils/exceptions'

export const DEFAULT_FIELDS = {
  name: '',
  dni: '',
  accountType: '',
  leasingId: null,
  dates: null,
  ceco: '',
  cecoDesc: '',
  assetType: [],
  personId: '',
}

export function parseSearch(search) {
  const data = { ...search }
  data.dates = data.fromDate
    ? [data.fromDate, data.toDate].map((d) => (d ? parseToDate(d, '-') : null))
    : DEFAULT_FIELDS.dates
  data.leasingId = data?.leasingId?.map((l) => parseInt(l, 10)) || []
  data.assetType = data?.assetType?.map((l) => parseInt(l, 10)) || []
  delete data.fromDate
  delete data.toDate
  return { ...DEFAULT_FIELDS, ...data }
}

export function useAssetAssignmentInfo({ onError }) {
  const QUERIES = [AssetService.leasing, AssetService.typeAsset]
  const queryClient = useQueryClient()
  const [data, setData] = useState({
    leasings: [],
    activeTypes: [],
    isSuccess: false,
  })
  useEffect(() => {
    const controller = new AbortController()
    multiFetch(
      QUERIES.map(
        (query) => () =>
          queryClient.fetchQuery(
            [query.id],
            () => query.get({ signal: controller.signal }),
            { staleTime: Infinity },
          ),
      ),
    )
      .then((res) => {
        const [leasingsData, activeTypesData] = res
        const leasings =
          leasingsData?.map((r) => ({ value: r.id, label: r.description })) ||
          []
        const activeTypes =
          activeTypesData?.map((r) => ({
            value: r.id,
            label: r.description,
          })) || []
        setData({ leasings, activeTypes, isSuccess: true })
      })
      .catch(onError)
    return () => {
      controller.abort()
    }
  }, [])
  const { isSuccess, ...options } = data
  return { options, isSuccess }
}

export default function SearchForm({ isLoading, searchLicenses, clearAssets }) {
  const [searchParams, setSearchParams] = useUrlParams({
    ...DEFAULT_FIELDS,
    fromDate: '',
    toDate: '',
  })
  const toast = useToast()

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    defaultValues: DEFAULT_FIELDS,
  })
  const { options, isSuccess } = useAssetAssignmentInfo({
    onError: (err) => toast.error(err),
  })

  useEffect(() => {
    if (isSuccess) {
      reset(parseSearch(searchParams))
    }
  }, [isSuccess])

  function formatSearch(formData, applyClear = true) {
    if (!formData.personId && (formData.dni || formData.name)) {
      if (applyClear) {
        clearAssets()
      }
      toast.warn('Debes seleccionar DNI o nombre de la lista')
      return null
    }
    const data = { ...formData }
    if (data.personId && !data.dni && !data.name) {
      delete data.personId
    }
    delete data.name
    if (formData.dates && formData.dates.length > 0) {
      data.fromDate = formatSearchDate(formData.dates[0])
      if (formData.dates[1]) {
        data.toDate = formatSearchDate(formData.dates[1])
      }
    }
    delete data.dates
    return data
  }
  const [isReporting, setIsReporting] = useState(false)
  function onDownload() {
    const formData = getValues()
    const formattedData = formatSearch(formData, false)
    if (formattedData) {
      formattedData.excel = true
      setIsReporting(true)
      AssetService.assignments
        .get(formattedData)
        .catch((err) => {
          if (err?.name === ERROR_TAGS.VOID_REPORT.TAG) {
            toast.warn(err.message)
          } else {
            toast.error(String(err))
          }
        })
        .finally(() => {
          setIsReporting(false)
        })
    }
  }
  function onSubmit(formData) {
    const formattedData = formatSearch(formData)
    if (formattedData) {
      setSearchParams(formattedData)
      searchLicenses(formattedData)
    }
  }
  function handleError(errors) {
    const messages = Object.values(errors)
      .slice(0, 4)
      .map((e) => e.message)
    toast.error(messages)
  }
  return (
    <form className="form" onSubmit={handleSubmit(onSubmit, handleError)}>
      <div className="form-group">
        <div>
          <label htmlFor="dni">DNI:</label>
          <FormAutoComplete
            // request={AssetService.filters.dni}
            request={(info) =>
              PersonService.filters({ dni: info, activeOnly: false }).then(
                (rows) => {
                  if (rows.length > 0) {
                    return rows
                  }
                  setValue('name', '')
                  setValue('personId', '')
                  return rows
                },
              )
            }
            onSelect={(e) => {
              const { name, personId } = e.value
              setValue('name', name)
              setValue('personId', personId)
            }}
            minLength={3}
            field="dni"
            name="dni"
            control={control}
          />
        </div>
        <div>
          <label htmlFor="name">Nombre:</label>
          <FormAutoComplete
            // request={AssetService.filters.name}
            request={(info) =>
              PersonService.filters({ name: info, activeOnly: false }).then(
                (rows) => {
                  if (rows.length > 0) {
                    return rows
                  }
                  setValue('dni', '')
                  setValue('personId', '')
                  return rows
                },
              )
            }
            name="name"
            onSelect={(e) => {
              const { dni, personId } = e.value
              setValue('dni', dni)
              setValue('personId', personId)
            }}
            field="name"
            minLength={3}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="leasingId">Leasing ID:</label>
          <FormMultiSelect
            name="leasingId"
            options={options.leasings}
            style={{ width: '18rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="assetType">Tipo de activo:</label>
          <FormMultiSelect
            name="assetType"
            options={options.activeTypes}
            style={{ width: '18rem' }}
            control={control}
          />
        </div>
        <div>
          <label htmlFor="dates">Periodo:</label>
          <FormCalendar
            name="dates"
            control={control}
            calendarProps={{
              selectionMode: 'range',
              readOnlyInput: true,
              dateFormat: 'dd/mm/yy'
            }}
          />
        </div>
      </div>
      <div className="form-group">
        <div>
          <label htmlFor="ceco">CeCo:</label>
          <FormAutoComplete
            request={AssetService.filters.ceco}
            minLength={2}
            name="ceco"
            control={control}
          />
        </div>
        <div>
          <label htmlFor="accountType">Tipo de cuenta:</label>
          <FormDropdown
            name="accountType"
            control={control}
            options={ACCOUNT_TYPES}
          />
        </div>
        <div>
          <label htmlFor="serialNum">Nro de serie:</label>
          <FormAutoComplete
            request={AssetService.filters.serialNum}
            minLength={3}
            name="serialNum"
            control={control}
          />
        </div>
        <div className="action">
          <Button
            icon="pi pi-filter-slash"
            className="icon-button"
            type="button"
            onClick={() => {
              setSearchParams({})
              reset(DEFAULT_FIELDS)
              clearAssets(0)
            }}
          />
        </div>
        <div className="action">
          <Button
            icon="pi pi-download"
            className="icon-button"
            type="button"
            loading={isReporting}
            onClick={onDownload}
          />
        </div>

        <div className="primary-button">
          <Button
            label="Buscar"
            loading={isLoading}
            className="search"
            loadingIcon="pi pi-spin pi-spinner"
            icon="pi pi-search"
            iconPos="right"
            type="submit"
          />
        </div>
      </div>
    </form>
  )
}
