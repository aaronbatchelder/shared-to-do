import { startOfWeek, endOfWeek, addWeeks, subWeeks, format, parseISO } from 'date-fns'

export function getWeekStart(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 0 })
}

export function getWeekEnd(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 0 })
}

export function formatWeekRange(startDate: Date): string {
  const end = getWeekEnd(startDate)
  return `${format(startDate, 'MMM d')} - ${format(end, 'MMM d')}`
}

export function getNextWeek(currentStart: Date): Date {
  return addWeeks(currentStart, 1)
}

export function getPrevWeek(currentStart: Date): Date {
  return subWeeks(currentStart, 1)
}

export function isCurrentWeek(startDate: Date): boolean {
  const currentWeekStart = getWeekStart(new Date())
  return format(startDate, 'yyyy-MM-dd') === format(currentWeekStart, 'yyyy-MM-dd')
}

export function formatDateForDb(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function parseDateFromDb(dateStr: string): Date {
  return parseISO(dateStr)
}
