export function parseDateRead(dateString) {
  const date = new Date(dateString);

  const year = date.getFullYear();

  const startOfYear = new Date(year, 0, 1);
  const dayOfYear =
    Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

  let season;
  if (dayOfYear <= 59) {
    season = "winter"; // 1/1 - 2/29
  } else if (dayOfYear <= 151) {
    season = "spring"; // 3/1 - 5/31
  } else if (dayOfYear <= 243) {
    season = "summer"; // 6/1 - 8/31
  } else if (dayOfYear <= 334) {
    season = "fall"; // 9/1 - 11/30
  } else {
    season = "winter"; // 12/1 - 12/31
  }
  return {
    year,
    dayOfYear,
    season,
  };
}
