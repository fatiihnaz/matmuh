export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export const DAY_KEYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export const FIRST_HOUR = 9;

export const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => {
  const hour = String(FIRST_HOUR + i).padStart(2, "0");
  return `${hour}.00 - ${hour}.50`;
});
