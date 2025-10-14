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

export function getMonthNameInSpanish(monthNumber: number) {
    // Create a Date object. The year and day don't matter as we only need the month.
    // monthNumber is 0-indexed, so 0 is January, 1 is February, etc.
    const date = new Date(2000, monthNumber, 1);

    // Create an Intl.DateTimeFormat instance for Spanish (es-ES)
    // and specify that we want the 'long' (full) month name.
    const formatter = new Intl.DateTimeFormat("es-ES", { month: "long" });

    // Format the date to get the Spanish month name.
    return formatter.format(date);
}