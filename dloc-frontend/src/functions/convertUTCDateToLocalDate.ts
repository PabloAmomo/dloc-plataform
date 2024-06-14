const convertUTCDateToLocalDate = (stringUTC: string | undefined | null) : Date | undefined => {
  if (!stringUTC) return undefined;
  const date = new Date(stringUTC);
  const newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
  const offset = date.getTimezoneOffset() / 60;
  const hours = date.getHours();
  newDate.setHours(hours - offset);
  return newDate;   
}

export default convertUTCDateToLocalDate;