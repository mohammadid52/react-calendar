import moment from "moment";
import { chunk, concat, filter, includes, map, times } from "lodash";
import HijriDate from "./hijri_date";

const MIN_CALENDAR_YEAR = 1000;
const MAX_CALENDAR_YEAR = 3000;

const hijriCalendar = (
  year,
  month,
  iso8601,
  { miqaats, customEvents } = {}
) => {
  const minYear = MIN_CALENDAR_YEAR;
  const maxYear = MAX_CALENDAR_YEAR;

  const dayOfWeek = (date) => {
    const hijriDate = new HijriDate(year, month, date);
    const offset = iso8601 ? 0.5 : 1.5;
    return (hijriDate.toAJD() + offset) % 7;
  };

  const days = () => {
    const daysLength = HijriDate.daysInMonth(year, month);
    const array = map(times(daysLength), (i) => {
      const hijriDate = new HijriDate(year, month, i + 1);
      const gregorianDate = hijriDate.toGregorian();

      const miqaatsToday = filter(miqaats, {
        date: hijriDate.day,
        month: hijriDate.month,
      });

      const englishEvents = filter(
        customEvents,
        (item) =>
          item.miqaatType === "english" &&
          ((item.greg.month === gregorianDate.getMonth() &&
            item.greg.date === gregorianDate.getDate()) ||
            (item.eventType === "daily_reminder" &&
              includes(item.weekDays, moment(gregorianDate).day())) ||
            (item.eventType === "monthly_reminder" &&
              item.greg.date === gregorianDate.getDate()))
      );

      const hijriEvents = filter(
        customEvents,
        (item) =>
          item.miqaatType === "hijri" &&
          ((item.hijri.date === hijriDate.day &&
            item.hijri.month === hijriDate.month) ||
            (item.eventType === "daily_reminder" &&
              includes(item.weekDays, moment(gregorianDate).day())) ||
            (item.eventType === "monthly_reminder" &&
              item.hijri.date === hijriDate.day))
      );

      const day = dayHash(hijriDate, gregorianDate, false, miqaatsToday, {
        englishEvents,
        hijriEvents,
      });
      return day;
    });
    return array;
  };

  const weeks = () => chunk(concat(previousDays(), days(), nextDays()), 7);

  const previousMonth = () => {
    const $year = month === 0 && year > minYear ? year - 1 : year;
    let $month;

    if (month === 0 && year === MIN_CALENDAR_YEAR) $month = month;
    else if (month === 0) $month = 11;
    else $month = month - 1;

    return hijriCalendar($year, $month, iso8601);
  };

  const nextMonth = () => {
    const $year = month === 11 && year < maxYear ? year + 1 : year;
    let $month;

    if (month === 11 && year === maxYear) $month = month;
    else if (month === 11) $month = 0;
    else $month = month + 1;

    return hijriCalendar($year, $month, iso8601);
  };

  const previousDays = () => {
    const $previousMonth = previousMonth();
    const daysInPreviousMonth = HijriDate.daysInMonth(
      $previousMonth.year,
      $previousMonth.month
    );
    const dayAtStartOfMonth = dayOfWeek(1);

    if (month === 0 && year === minYear) {
      return times(6 - dayAtStartOfMonth);
    }

    const daysItem = map(times(dayAtStartOfMonth), (day) => {
      const hijriDate = new HijriDate(
        $previousMonth.year,
        $previousMonth.month,
        daysInPreviousMonth - dayAtStartOfMonth + day + 1
      );
      const gregorianDate = hijriDate.toGregorian();
      return dayHash(hijriDate, gregorianDate, true);
    });

    return daysItem;
  };

  const nextDays = () => {
    const $nextMonth = nextMonth();
    const daysInMonth = HijriDate.daysInMonth(year, month);
    const dayAtEndOfMonth = dayOfWeek(daysInMonth);

    const daysItem = map(times(6 - dayAtEndOfMonth), (day) => {
      const hijriDate = new HijriDate(
        $nextMonth.year,
        $nextMonth.month,
        day + 1
      );
      const gregorianDate = hijriDate.toGregorian();
      return dayHash(hijriDate, gregorianDate, true);
    });

    return daysItem;
  };

  // return Hijri Calendar object for the previous year
  const previousYear = () => {
    const $year = year === minYear ? minYear : year - 1;
    return hijriCalendar($year, month, iso8601, {});
  };

  // return Hijri Calendar object for the next year
  const nextYear = () => {
    const $year = year === maxYear ? maxYear : year + 1;
    return hijriCalendar($year, month, iso8601, {});
  };

  const dayHash = (
    hijriDate,
    gregorianDate,
    isFiller,
    miqaatsData = [],
    { hijriEvents = [], englishEvents = [] } = {}
  ) => ({
    hijri: {
      year: hijriDate.getYear(),
      month: hijriDate.getMonth(),
      date: hijriDate.getDate(),
      events: concat(hijriEvents),
    },
    gregorian: {
      year: gregorianDate.getFullYear(),
      month: gregorianDate.getMonth(),
      date: gregorianDate.getDate(),
      events: concat(englishEvents),
    },
    miqaatsData,
    ajd: hijriDate.toAJD(),
    filler: isFiller ? true : undefined,
  });

  return {
    days,
    weeks,
    year,
    month,
    iso8601,
    minYear,
    maxYear,
    previousMonth,
    nextMonth,
    dayOfWeek,
    previousYear,
    nextYear,
  };
};

export default hijriCalendar;
