/* The affiliate tab stays open until its native toggle, an outside pointer or Escape closes it. */
(() => {
  const host = document.querySelector('ohmyhost-flag');
  const details = host?.shadowRoot?.querySelector('details');
  const summary = host?.shadowRoot?.querySelector('summary');
  if (!details || !summary) return;

  const label = () => summary.setAttribute('aria-label', details.open ? 'Close affiliate information' : 'Open affiliate information');
  details.addEventListener('toggle', label);
  document.addEventListener('pointerdown', event => {
    if (details.open && !event.composedPath().includes(host)) details.open = false;
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !details.open) return;
    details.open = false;
    summary.focus();
  });
  label();
})();
