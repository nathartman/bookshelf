interface SeasonInfo {
  year: number;
  dayOfYear: number;
  season: string;
}

export function parseDateRead(dateString?: string): SeasonInfo {
  const date = dateString ? new Date(dateString) : new Date();

  const year = date.getFullYear();

  const startOfYear = new Date(year, 0, 1);
  const dayOfYear =
    Math.floor((date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000)) + 1;

  let season: string;
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
