/** convenience: write a CSS variable to :root */
export function setCssVar(key, value) {
  document.documentElement.style.setProperty(key, value);
}
