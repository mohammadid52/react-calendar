import moment from 'lib/datetime/moment'
import { chunk, concat, map, times } from 'lodash'

const gregCalendar = (year, month) => {
  const dayOfWeek = date => moment({ year, month, date }).weekday() % 7

  const days = () => {
    const daysLength = moment({ year, month }).daysInMonth()
    return map(times(daysLength), i => ({ year, month, date: i + 1, filler: false }))
  }

  const weeks = () => chunk(concat(previousDays(), days(), nextDays()), 7)

  const previousDays = () => {
    const prevMonth = moment({ year, month }).add(-1, 'month')
    const daysInPreviousMonth = prevMonth.daysInMonth()
    const dayAtStartOfMonth = dayOfWeek(1)

    return map(times(dayAtStartOfMonth), day => ({ year: prevMonth.year(), month: prevMonth.month(), date: daysInPreviousMonth - dayAtStartOfMonth + day + 1, filler: true }))
  }

  const nextDays = () => {
    const nextMonth = moment({ year, month }).add(1, 'month')
    const daysInMonth = nextMonth.daysInMonth()
    const dayAtEndOfMonth = dayOfWeek(daysInMonth)
    return map(times(6 - dayAtEndOfMonth), day => ({ year: nextMonth.year(), month: nextMonth.month(), date: day + 1, filler: true }))
  }

  const previousMonth = () => {
    const newDate = moment({ year, month }).add(-1, 'month')
    return gregCalendar(newDate.year(), newDate.month())
  }

  const nextMonth = () => {
    const newDate = moment({ year, month }).add(1, 'month')
    return gregCalendar(newDate.year(), newDate.month())
  }

  // return Hijri Calendar object for the previous year
  //   const previousYear = () => {
  //     const $year = year === minYear ? minYear : year - 1
  //     return gregCalendar($year, month, iso8601, {})
  //   }

  //   // return Hijri Calendar object for the next year
  //   const nextYear = () => {
  //     const $year = year === maxYear ? maxYear : year + 1
  //     return gregCalendar($year, month, iso8601, {})
  //   }

  return {
    days,
    weeks,
    year,
    month,
    previousMonth,
    nextMonth,
    dayOfWeek,
  }
}

export default gregCalendar
