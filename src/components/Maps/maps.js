export const getGoogleMapsSearchUrl = (lat, long) => {
  if (!lat || !long) return ''

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lat)},${encodeURIComponent(long)}`
}

export const openGoogleMapsByCoordinates = (lat, long, target = '_blank') => {
  const url = getGoogleMapsSearchUrl(lat, long)
  if (!url) return false

  window.open(url, target)
  return true
}
