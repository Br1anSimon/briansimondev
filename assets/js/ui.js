/** Small page interactions that don't depend on three.js. */

export function initCopyEmail() {
  const button = document.getElementById('copy-email');
  const status = document.getElementById('copy-status');
  const email = document.getElementById('email');
  if (!button || !status || !email) return;

  const copied = () => {
    status.textContent = 'Copied to clipboard.';
    setTimeout(() => (status.textContent = ''), 3500);
  };
  const selectText = () => {
    const range = document.createRange();
    range.selectNodeContents(email);
    const sel = getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    status.textContent = 'Selected. Press Ctrl+C or Cmd+C to copy.';
  };

  button.addEventListener('click', () => {
    try {
      navigator.clipboard.writeText(email.textContent.trim()).then(copied, selectText);
    } catch {
      selectText();
    }
  });
}

export function initYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}

/** Scale each 1440px-wide concept-site iframe down to fit its card. */
export function initDemoPreviews() {
  const screens = document.querySelectorAll('.demo-screen');
  if (!screens.length) return;
  const fit = (el) => el.style.setProperty('--demo-scale', el.clientWidth / 1440);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver((entries) => entries.forEach((e) => fit(e.target)));
    screens.forEach((el) => ro.observe(el));
  } else {
    screens.forEach(fit);
    addEventListener('resize', () => screens.forEach(fit));
  }
}
