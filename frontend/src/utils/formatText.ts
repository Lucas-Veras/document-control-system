export const formatText = (text: string, maxChar = 190) => {
  if (text.length > maxChar) return text.slice(0, maxChar) + "...";
  return text;
};
