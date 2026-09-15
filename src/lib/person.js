export function fullName(person) {
  return [person?.firstName, person?.lastName].filter(Boolean).join(" ");
}
