import { useMutation as useMutationRQ, useQuery as useQueryRQ, useQueryClient } from '@tanstack/react-query'

export function useQuery(keys, fetcher, options) {
  return useQueryRQ(keys, fetcher, options)
}

export function useMutation(key, mutation) {
  const queryClient = useQueryClient()
  return useMutationRQ(mutation, {
    onSuccess: () => {
      queryClient.invalidateQueries([key])
    }
  })
}
