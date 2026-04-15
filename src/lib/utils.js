function toClassList(value) {
  if (!value) return []

  if (typeof value === 'string') return [value]

  if (Array.isArray(value)) {
    return value.flatMap((item) => toClassList(item))
  }

  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, enabled]) => Boolean(enabled))
      .map(([className]) => className)
  }

  return []
}

export function cn(...inputs) {
  return inputs
    .flatMap((input) => toClassList(input))
    .filter(Boolean)
    .join(' ')
}
