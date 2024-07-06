import { getCATTime } from "@/helpers/dateTime";

export function CalculateWaitingTime({

    arrival_time,
  }: {

    arrival_time: any;
  }) {
  
    const currentTime: any = getCATTime();
  
    const differenceInMilliseconds = currentTime - Date.parse(arrival_time);
  
    let waitingTime;
  
    const seconds = Math.floor(differenceInMilliseconds / 1000);
    if (seconds < 60) {
      waitingTime = `${seconds} seconds`;
    } else {
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) {
        waitingTime = `${minutes} minutes`;
      } else {
        const hours = Math.floor(minutes / 60);
        waitingTime = `${hours} hours`;
      }
    }
  
    return waitingTime;
  }
  