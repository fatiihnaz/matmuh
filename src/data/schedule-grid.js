export const DAYS = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];

export const DAY_KEYS = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"];

export const FIRST_HOUR = 9;

// 09:00-20:50. On dilimle sinirliyken 19:00'daki dersler `toEntry`'de sessizce
// eleniyordu (indeks sinir disi -> null); OBS programinda ITB dersleri 19:00'a
// kadar iniyor. Bos saatler `buildRows` tarafindan zaten katlaniyor, yani genis
// aralik bos ekranda yer kaplamiyor.
export const TIME_SLOTS = Array.from({ length: 12 }, (_, i) => {
  const hour = String(FIRST_HOUR + i).padStart(2, "0");
  return `${hour}.00 - ${hour}.50`;
});
