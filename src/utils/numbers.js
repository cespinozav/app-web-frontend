export function formatNumber(num, digits = 2) {
  let value = num
  if (typeof num === 'string' && num.trim() !== '') {
    value = Number(num)
  }
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return ''
  }
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })
}

export function formatMoney(amountObj, useDollars, digits = 2) {
  let amount = useDollars ? amountObj.usd : amountObj.pen
  if (typeof amount === 'string' && amount.trim() !== '') {
    amount = Number(amount)
  }
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return ''
  }
  const amountStr = Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })

  return `${useDollars ? '$' : 'S/'}${amountStr}`
}
