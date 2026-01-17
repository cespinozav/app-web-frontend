import { KitService } from 'services'
import { multiFetch } from 'utils/network'
import { useQueries, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const QUERIES = [
  KitService.operators,
  KitService.contract,
  KitService.models,
  KitService.plans,
  KitService.typeService,
  KitService.additionalService,
  KitService.seats,
  { id: 'unit', get: ({ signal }) => KitService.filters.unit({ signal }) },
]

export function useKitAssignmentQueries(onError) {
  const [operatorsQuery, contractsQuery, modelsQuery, plansQuery, typesQuery] =
    useQueries({
      queries: QUERIES.map((query) => ({
        queryKey: [query.id],
        queryFn: query.get,
        staleTime: Infinity,
        onError,
      })),
    })
  const operators =
    operatorsQuery.data?.map((operator) => ({
      value: operator.id,
      label: operator.description,
    })) || []
  const contracts =
    contractsQuery.data?.map((p) => ({
      label: p.description,
      value: p.id,
      operator: p.operatorId,
    })) || []
  const plans =
    plansQuery.data?.map((p) => ({
      label: p.description,
      value: p.id,
      operator: p.operatorId,
      type: p.typeServiceId,
    })) || []
  const types =
    typesQuery.data?.map((d) => ({ label: d.description, value: d.id })) || []
  const models = []
  const brands = []
  modelsQuery.data?.forEach((model) => {
    models.push({
      label: model.description,
      value: model.id,
      brandId: model.brandId,
    })
    if (!brands.find((b) => b.value === model.brandId)) {
      brands.push({ value: model.brandId, label: model.brandName })
    }
  })
  const queries = [
    operatorsQuery,
    contractsQuery,
    modelsQuery,
    plansQuery,
    typesQuery,
  ]
  return {
    data: { operators, contracts, brands, models, plans, types },
    // isLoading: Boolean(queries.some(q => q.isLoading)),
    isSuccess: Boolean(queries.every((q) => q.isSuccess)),
  }
}

export async function fetchOptions(signal) {
  return multiFetch([
    () =>
      KitService.operators.get({ signal }).then((data) => {
        const operators = data.map((operator) => ({
          value: operator.id,
          label: operator.description,
        }))
        return operators
      }),
    () =>
      KitService.contract.get({ signal }).then((plans) =>
        plans.map((p) => ({
          label: p.description,
          value: p.id,
          operator: p.operatorId,
        })),
      ),
    () =>
      KitService.models.get({ signal }).then((res) => {
        const brands = []
        const models = []
        res.forEach((model) => {
          models.push({
            label: model.description,
            value: model.id,
            brandId: model.brandId,
          })
          if (!brands.find((b) => b.value === model.brandId)) {
            brands.push({ value: model.brandId, label: model.brandName })
          }
        })
        return [brands, models]
      }),
    () =>
      KitService.plans.get({ signal }).then((plans) =>
        plans.map((p) => ({
          label: p.description,
          value: p.id,
          operator: p.operatorId,
          type: p.typeServiceId,
        })),
      ),
    () =>
      KitService.typeService
        .get({ signal })
        .then((data) =>
          data.map((d) => ({ label: d.description, value: d.id })),
        ),
    () =>
      KitService.additionalService.get({ signal }).then((additionals) =>
        additionals.map((p) => ({
          label: p.description,
          value: p.id,
          operator: p.operatorId,
        })),
      ),
  ])
}

export function useKitAssignmentInfo({ onError }) {
  const queryClient = useQueryClient()
  const [data, setData] = useState({
    brands: [],
    models: [],
    plans: [],
    contracts: [],
    operators: [],
    types: [],
    seats: [],
    additionals: [],
    units: [],
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
        const [
          operatorsData,
          contractsData,
          modelsData,
          plansData,
          typesData,
          additionalsData,
          seatsData,
          unitsData,
        ] = res
        const operators =
          operatorsData?.map((operator) => ({
            value: operator.id,
            label: operator.description,
          })) || []
        const contracts =
          contractsData?.map((p) => ({
            label: p.description,
            value: p.id,
            operator: p.operatorId,
          })) || []
        const plans =
          plansData?.map((p) => ({
            label: p.description,
            value: p.id,
            operator: p.operatorId,
            type: p.typeServiceId,
          })) || []
        const types =
          typesData?.map((d) => ({ label: d.description, value: d.id })) || []
        const models = []
        const brands = []
        modelsData?.forEach((model) => {
          models.push({
            label: model.description,
            value: model.id,
            brandId: model.brandId,
          })
          if (!brands.find((b) => b.value === model.brandId)) {
            brands.push({ value: model.brandId, label: model.brandName })
          }
        })
        const seats =
          seatsData?.map((seat) => ({
            value: seat.id,
            label: seat.description,
          })) || []
        const additionals =
          additionalsData?.map((additional) => ({
            value: additional.id,
            label: additional.description,
          })) || []
        const units = unitsData.map((u) => ({ label: u, value: u }))
        setData({
          operators,
          contracts,
          brands,
          models,
          plans,
          types,
          additionals,
          seats,
          units,
          isSuccess: true,
        })
      })
      .catch(onError)
    return () => {
      controller.abort()
    }
  }, [])
  const { isSuccess, ...options } = data
  return { isSuccess, options }
}
