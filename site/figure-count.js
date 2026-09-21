/* Counts figure numbers up when they scroll into view; the static values stay for no-JS and reduced motion. */
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const format = (value, decimals) =>
    value.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/gu, ",");
  const run = (node) => {
    const target = node.dataset.countTo || "0";
    const to = Number(target);
    const decimals = (target.split(".")[1] || "").length;
    const suffix = node.dataset.suffix || "";
    const start = performance.now();
    const step = (now) => {
      const k = Math.min((now - start) / 950, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      node.textContent = format(to * eased, decimals) + suffix;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target);
      }),
    { threshold: 0.4 },
  );
  document
    .querySelectorAll(".fig .count")
    .forEach((node) => observer.observe(node));
})();
