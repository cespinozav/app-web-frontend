import { getContract } from './utils'

describe('getContract function tests', () => {
  it('Get TERMINADO when endDate is before today', () => {
    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 1)
    expect(getContract({ startDate: new Date('2022-09-01T00:00:00-05:00'), endDate })).toEqual({
      label: 'TERMINADO',
      subLabel: '0 meses',
      classname: 'contract status--red'
    })
  })

  it('Get - when startDate is after today', () => {
    const date = new Date()
    date.setDate(date.getDate() + 1)
    expect(getContract({ startDate: date, endDate: date })).toEqual({
      label: '-',
      subLabel: '-',
      classname: 'contract status--black'
    })
  })

  it('Get VIGENTE when no startDate', () => {
    expect(getContract({ startDate: null, endDate: null })).toEqual({
      label: 'VIGENTE',
      subLabel: 'Indefinido',
      classname: 'contract status--green'
    })
  })

  it('Get VIGENTE and 3 months endDate is ahead by 3 months', () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 1)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 93)
    expect(getContract({ startDate, endDate })).toEqual({
      label: 'VIGENTE',
      subLabel: '3 meses',
      classname: 'contract status--green'
    })
  })

  it('Get POR VENCER and 2 months endDate is ahead by 2 months', () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 1)
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 65)
    expect(getContract({ startDate, endDate })).toEqual({
      label: 'POR VENCER',
      subLabel: '2 meses',
      classname: 'contract status--yellow'
    })
  })

  it('Get VIGENTE and Indefinido when there is no endDate and startDate < today', () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 1)
    expect(getContract({ startDate, endDate: null })).toEqual({
      label: 'VIGENTE',
      subLabel: 'Indefinido',
      classname: 'contract status--green'
    })
  })

  it('Get - and Indefinido when there is no endDate and startDate > today', () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + 1)
    expect(getContract({ startDate, endDate: null })).toEqual({
      label: '-',
      subLabel: 'Indefinido',
      classname: 'contract status--black'
    })
  })
})
