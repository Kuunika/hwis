import dayjs from "dayjs";

export const getDateTime = () => {
  let date = new Date();

  date.setUTCHours(date.getUTCHours() + 2); // Add 2 hours for CAT (UTC+2)

  return date.toISOString();
}

export const calculateAge = (birthdate: string | Date | undefined) => {

  if (!birthdate) return null
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

  return `${hours}:${minutes}:${seconds}`
}

export const estimateBirthdate = (years: number) => {
  const estimate = dayjs().subtract(years, 'year')
  return {
    iso: estimate.toISOString(),
    readable: estimate.format('DD MMMM YYYY')
  }
}

export const getHumanReadableDate = (date:string|Date)=>{
  return dayjs(date).format('dddd, MMMM D, YYYY');
}
export const getHumanReadableDateTime = (date:string|Date|undefined)=>{

  if(!date) return ""

  return dayjs(date).format('dddd, MMMM D, YYYY h:mm A');
}