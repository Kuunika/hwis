import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { getServerTime } from "@/services/serverTime";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getDateTime = async (): Promise<string> => {
  if (!ServerTime.isInitialized()) {
    try {
      await ServerTime.initialize();
    } catch (error) {
      console.error("Failed to initialize server time:", error);
      // Return local time as fallback
      return new Date().toISOString();
    }
  }

  return ServerTime.getServerTimeString();
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
  // Match the time part directly from the ISO string
  const match = dateString.match(/T(\d{2}:\d{2}:\d{2})/);
  return match ? match[1] : "";
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
export const getHumanReadableShortDate = (date: any) => {
  return dayjs(date).format(" D MMM, YYYY");
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
export const getShortDate = (date: string | Date | undefined) => {
  if (!date) return "";

  return dayjs(date).format("DD-MM-YY");
};

export const getShortDateTime = (date: string | Date | undefined) => {
  if (!date) return "";

  return dayjs(date).format("DD-MM-YY HH:mm");
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

export function extractDateTime(dates: Date[]): string[] {
  if (!dates) return [];
  return dates.map((date) => {
    return getShortDate(date);
  });
}

// services/serverTime.ts
let serverTimeOffset: number | null = null;
let serverTimezoneOffset: number = 0;
let originalServerTimeString: string | null = null;

export interface ServerTimeService {
  initialize: () => Promise<void>;
  now: () => Date;
  getOffset: () => number | null;
  getServerTimeString: () => string;
  isInitialized: () => boolean;
}

export const ServerTime: ServerTimeService = {
  initialize: async (): Promise<void> => {
    try {
      const start = Date.now();
      const response = await getServerTime();
      const end = Date.now();

      originalServerTimeString = response.data.server_time;
      const serverTime = new Date(originalServerTimeString);

      const timezoneMatch = originalServerTimeString.match(/[+-]\d{2}:\d{2}$/);
      if (timezoneMatch) {
        const [hours, minutes] = timezoneMatch[0].split(":").map(Number);
        serverTimezoneOffset = hours * 60 + minutes;
      }

      const roundTripTime = end - start;
      serverTimeOffset = serverTime.getTime() - (start + roundTripTime / 2);
    } catch (error) {
      console.error("Failed to get server time:", error);
      serverTimeOffset = 0;
      serverTimezoneOffset = new Date().getTimezoneOffset();
    }
  },

  now: (): Date => {
    if (serverTimeOffset === null) {
      throw new Error("Server time not initialized. Call initialize() first.");
    }
    return new Date(Date.now() + serverTimeOffset);
  },

  getOffset: (): number | null => serverTimeOffset,

  getServerTimeString: (): string => {
    if (serverTimeOffset === null) {
      throw new Error("Server time not initialized");
    }

    // Get current server time in UTC milliseconds
    const utcNow = Date.now() + serverTimeOffset;

    // Apply server timezone offset to get local server time
    const serverNow = new Date(utcNow + serverTimezoneOffset * 60 * 1000);

    // Format components using server's local time
    const year = serverNow.getUTCFullYear();
    const month = (serverNow.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = serverNow.getUTCDate().toString().padStart(2, "0");
    const hours = serverNow.getUTCHours().toString().padStart(2, "0");
    const minutes = serverNow.getUTCMinutes().toString().padStart(2, "0");
    const seconds = serverNow.getUTCSeconds().toString().padStart(2, "0");
    const milliseconds = serverNow
      .getUTCMilliseconds()
      .toString()
      .padStart(3, "0");

    // Format timezone offset
    const tzHours = Math.abs(Math.floor(serverTimezoneOffset / 60))
      .toString()
      .padStart(2, "0");
    const tzMinutes = Math.abs(serverTimezoneOffset % 60)
      .toString()
      .padStart(2, "0");
    const tzSign = serverTimezoneOffset >= 0 ? "+" : "-";

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${tzSign}${tzHours}:${tzMinutes}`;
  },
  isInitialized: (): boolean => serverTimeOffset !== null,
};
