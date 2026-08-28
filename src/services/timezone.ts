import { DateTime } from "luxon";
export function previousLocalDayUtcRange(now: Date, zone = "America/Bahia") {
  const day = DateTime.fromJSDate(now, {zone}).minus({days:1});
  return { localDate: day.toISODate()!, startDate: day.startOf("day").toUTC().toISO({suppressMilliseconds:true})!, endDate: day.endOf("day").toUTC().toISO({suppressMilliseconds:true})! };
}
