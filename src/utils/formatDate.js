export default function formatDate(dateString, locale = "ru-RU") {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
