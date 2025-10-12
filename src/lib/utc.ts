export const toUTC = (dateStr: string) => {
  if (!dateStr) return null;
  const localDate = new Date(dateStr);
  return new Date(
    Date.UTC(
      localDate.getFullYear(),
      localDate.getMonth(),
      localDate.getDate(),
      localDate.getHours(),
      localDate.getMinutes(),
      localDate.getSeconds(),
      localDate.getMilliseconds()
    )
  );
};