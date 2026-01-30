export function formatRelativeMinutes(iso: string) {
  return new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  }).format(Math.round((new Date(iso).getTime() - Date.now()) / 60000), "minute");
}
