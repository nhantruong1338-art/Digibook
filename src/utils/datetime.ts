export function formatIsoToViDate(iso: string, useUTC = false): string {
  const date = new Date(iso)
  const opts: Intl.DateTimeFormatOptions = {
    day: '2-digit', // "16"
    month: 'short', // "thg 10"
    year: 'numeric', // "2023"
    ...(useUTC ? { timeZone: 'UTC' } : {}),
  }
  return date.toLocaleDateString('vi-VN', opts)
}
