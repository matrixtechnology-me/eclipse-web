export const getInitials = (value: string): string => {
  if (!value) return "";

  const words = value.trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return "";

  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : "";

  return (first + last).toUpperCase();
};
