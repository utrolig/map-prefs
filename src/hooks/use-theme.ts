export const useTheme = () => {
  const theme = document.documentElement.getAttribute("data-theme") || "light";
  return theme as "light" | "dark";
};
