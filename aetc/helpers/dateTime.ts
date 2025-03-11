import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateTime = () => {
  let date = new Date();

  date.setUTCHours(date.getUTCHours() + 2); // Add 2 hours for CAT (UTC+2)

  return date.toISOString();
};

export const calculateAge = (birthdate: string | Date | undefined) => {
  if (!birthdate) return null;
  var today = new Date();
  var birthDate = new Date(birthdate);
  var age = today.getFullYear() - birthDate.getFullYear();
  var month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export function getCATTime() {
  const catOffset = 2; // CAT is UTC+2
  const catOffsetInMilliseconds = catOffset * 60 * 60 * 1000;
  const currentTimestamp = Date.now();
  const catTimestamp = currentTimestamp + catOffsetInMilliseconds;
  const catDate = new Date(catTimestamp);

  return catDate;
}

export const getTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  return `${hours}:${minutes}:${seconds}`;
};

export const estimateBirthdate = (years: number) => {
  const estimate = dayjs().subtract(years, "year");
  return {
    iso: estimate.toISOString(),
    readable: estimate.format("DD MMMM YYYY"),
  };
};

export const getHumanReadableDate = (date: string | Date) => {
  return dayjs(date).format("dddd, MMMM D, YYYY");
};
// export const getHumanReadableDateTime = (date: string | Date | undefined) => {

//   if (!date) return ""
//   return new Date(date).toLocaleString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: 'numeric',
//     minute: 'numeric',
//     second: 'numeric',
//   });
//   // return dayjs(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ').format('MMMM D, YYYY h:mm A')
// }

export const getHumanReadableDateTime = (
  isoString: string | Date | undefined
): string => {
  if (!isoString) return "";

  const isoStringFormatted =
    typeof isoString === "string" ? isoString : isoString.toISOString();

  const timePart = isoStringFormatted.split("T")[1].split("+")[0];
  const [hours, minutes, seconds] = timePart
    .split(":")
    .map((part) => part.split(".")[0]);

  let hoursNum = parseInt(hours, 10);
  const period = hoursNum >= 12 ? "PM" : "AM";
  const formattedHours = hoursNum % 12 || 12;

  const formattedTime = `${formattedHours}:${minutes.padStart(
    2,
    "0"
  )}:${seconds.padStart(2, "0")} ${period}`;

  const parsedDate = dayjs(isoStringFormatted).format("MMMM D, YYYY");
  return `${parsedDate} at ${formattedTime}`;
};

export const getHumanReadableDateTimeLab = (
  date: string | Date | undefined
) => {
  if (!date) return "";

  return dayjs(date).format("YYYY-MM-DD h:mm A");
};

export function isToday(dateString: string) {
  const inputDate = new Date(dateString);
  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())
  );
  const inputDateUTC = new Date(
    Date.UTC(
      inputDate.getUTCFullYear(),
      inputDate.getUTCMonth(),
      inputDate.getUTCDate()
    )
  );
  return inputDateUTC.getTime() === todayUTC.getTime();
}

export function extractTimes(dates: Date[]): string[] {
  return dates.map((date) => {
    const dateString = date.toString();
    const timePart = dateString.split(" ")[4];
    return timePart;
  });
}
