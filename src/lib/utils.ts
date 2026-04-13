// Lightweight cn utility — merges class strings, filters falsy
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
