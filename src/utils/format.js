export const formatNumber = (value, options = {}) => {
  const num = Number(value ?? 0)
  const { minimumFractionDigits = 0, maximumFractionDigits = 0 } = options
  return num.toLocaleString('es-AR', { minimumFractionDigits, maximumFractionDigits })
}

export const formatCurrency = (value, options = {}) => {
  const num = Number(value ?? 0)
  const { minimumFractionDigits = 0, maximumFractionDigits = 0, withSymbol = true } = options
  const formatted = num.toLocaleString('es-AR', { minimumFractionDigits, maximumFractionDigits })
  return withSymbol ? `$${formatted}` : formatted
}

export default { formatNumber, formatCurrency }

