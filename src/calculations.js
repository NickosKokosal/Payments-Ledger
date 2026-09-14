export const monthWord = (n, t) => (n === 1 ? t.monthSingular : t.monthPlural);

export const freqLabel = (p, t) => {
  if (p.frequency === "day") return t.freqDay;
  if (p.frequency === "week") return t.freqWeek;
  const n = p.monthsInterval || 1;
  return n === 12 ? t.freqYear : t.freqMonth.replace("X", n);
};

export const freqPerYear = (p) => {
  if (p.frequency === "day") return 365.25;
  if (p.frequency === "week") return 52.18;
  const n = p.monthsInterval || 1;
  return 12 / n;
};

export const eur = (n, t) =>
  n.toLocaleString(t.dateLocale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });

export const daysUntil = (dateStr, t) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  return Math.round((target - today) / (1000 * 60 * 60 * 24));
};

export const nextDateLabel = (dateStr, t) => {
  const d = daysUntil(dateStr);
  const formatted = new Date(dateStr).toLocaleDateString(t.dateLocale, {
    day: "numeric",
    month: "long",
  });
  if (d < 0) return `${formatted} · ${t.passed}`;
  if (d === 0) return `${formatted} · ${t.today}`;
  if (d === 1) return `${formatted} · ${t.tomorrow}`;
  return `${formatted} · ${t.inDays(d)}`;
};
