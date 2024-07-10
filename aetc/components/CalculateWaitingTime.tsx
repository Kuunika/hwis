import { getCATTime } from "@/helpers/dateTime";

export function CalculateWaitingTime({
  arrival_time,
}: {
  arrival_time: string; 
}) {
  const currentTime: any = getCATTime();
  const arrivalTime: number = Date.parse(arrival_time);
  const differenceInMilliseconds: number = currentTime - arrivalTime;

  let waitingTime: string;

  const seconds: number = Math.floor(differenceInMilliseconds / 1000);
  if (seconds < 60) {
    waitingTime = `${seconds} seconds`;
  } else {
    const minutes: number = Math.floor(seconds / 60);
    if (minutes < 60) {
      waitingTime = `${minutes} minutes`;
    } else {
      const hours: number = Math.floor(minutes / 60);
      if (hours < 24) {
        waitingTime = `${hours} hours`;
      } else {
        const days: number = Math.floor(hours / 24);
        const remainingHours: number = hours % 24;
        waitingTime = remainingHours > 0 ? `${days} days ${remainingHours} hours` : `${days} days`;
      }
    }
  }

  return waitingTime;
}
