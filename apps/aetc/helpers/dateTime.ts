
export const getDateTime = () => new Date().toISOString();

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


export const getTime = (dateString: string) => {
  const date = new Date(dateString);

  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();


  return `${hours}:${minutes}:${seconds}`
}