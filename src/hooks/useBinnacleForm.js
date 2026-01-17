import { useQuery } from './useRequest'

const DEFAULT_FIELDS = {
  classification: '',
  authorizer: null,
  method: '',
  reference: '',
  comment: '',
  documents: []
}

export default function useBinnacleForm(serviceId, serviceCallback, assignId, enabled) {
  const { data, isSuccess } = useQuery(
    [serviceId, { assignId, lastCreated: true }],
    ({ signal }) => serviceCallback({ assignId, signal, lastCreated: true }),
    { enabled }
  )
  const defaultData = data?.data?.[0]
  return {
    defaultBinnacleFields: defaultData
      ? {
          classification: defaultData.classificationId,
          authorizer: {
            name: defaultData.authorName,
            personId: defaultData.authorId
          },
          method: defaultData.method,
          reference: defaultData.reference,
          comment: defaultData.comments,
          documents: defaultData.documents
        }
      : { ...DEFAULT_FIELDS },
    isSuccess
  }
}

export function getDefaultBinnacle(assignment) {
  return assignment
    ? {
        classification: assignment.classificationId,
        authorizer: {
          name: assignment.authorName,
          personId: assignment.authorId
        },
        method: assignment.method,
        reference: assignment.reference,
        comment: assignment.comments,
        documents: assignment.documents,
        kitAmount: assignment.kitAmount,
        penaltyAmount: assignment.penaltyAmount,
        basicIncomeAmount: assignment.basicIncomeAmount,
        ssaaAmount: assignment.ssaaAmount,
        othersAmount: assignment.othersAmount
      }
    : { ...DEFAULT_FIELDS }
}
