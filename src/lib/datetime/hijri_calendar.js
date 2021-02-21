/* eslint-disable */

const HijriCalendar = (function () {
  const MIN_CALENDAR_YEAR = 1000
  const MAX_CALENDAR_YEAR = 3000

  // return array of weeks for this month and year

  // return array of days from beginning of week until start of this month and year

  // return array of days from end of this month and year until end of the week

  // private

  function dayHash(hijriDate, gregorianDate, isFiller) {
    return {
      hijri: {
        year: hijriDate.getYear(),
        month: hijriDate.getMonth(),
        date: hijriDate.getDate(),
      },
      gregorian: {
        year: gregorianDate.getFullYear(),
        month: gregorianDate.getMonth(),
        date: gregorianDate.getDate(),
      },
      ajd: hijriDate.toAJD(),
      filler: isFiller ? true : undefined,
    }
  }

  return hijriCalendar
})()

export default HijriCalendar
