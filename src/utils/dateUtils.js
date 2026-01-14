export const parseRobustDate = (dateInput) => {
  if (!dateInput) return null;
  
  let date;
  if (Array.isArray(dateInput)) {
    date = new Date(dateInput[0], dateInput[1] - 1, dateInput[2], dateInput[3] || 0, dateInput[4] || 0);
  } else if (typeof dateInput === 'object' && dateInput.year) {
    date = new Date(dateInput.year, (dateInput.monthValue || 1) - 1, dateInput.dayOfMonth || 1, dateInput.hour || 0, dateInput.minute || 0);
  } else {
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) return null;
  return date;
};

export const formatDate = (dateInput) => {
  const date = parseRobustDate(dateInput);
  if (!date) return 'Unbekannt';

  return date.toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
