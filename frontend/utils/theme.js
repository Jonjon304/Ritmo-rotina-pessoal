const THEME_KEY = 'myfinance-theme';

export function applyTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  if (theme === 'light') {
    document.documentElement.classList.add('light-theme');
  } else {
    document.documentElement.classList.remove('light-theme');
  }
}

export function getStoredTheme() {
  return localStorage.getItem(THEME_KEY) || 'dark';
}

export function initTheme() {
  applyTheme(getStoredTheme());
}
