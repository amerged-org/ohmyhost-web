/* Signup is open; the server supplies any r attribution as signup_source only. */
(() => {
  const source = document.querySelector('meta[name="ohmyhost-signup-source"]')?.content;
  const region = document.querySelector('meta[name="ohmyhost-region-hint"]')?.content;
  const prompt =
    "Read https://ohmyho.st/llms.txt and https://ohmyho.st/skills/ohmyhost-get-started/SKILL.md. Connect this agent to ohmyho.st and deploy this GitHub project using only the capabilities it needs. " +
    (source ? "I came from https://ohmyho.st/?r=" + encodeURIComponent(source) + ". " : "") +
    (region === "eu" || region === "us"
      ? "For a new project, use " + region.toUpperCase() + " based on this browser's region unless I specify another region. "
      : "For a new project, ask me once whether to use EU or US unless I already specified a region. ") +
    "Keep existing projects in their current region. " +
    "Follow the deployment Skill, keep my existing project decisions and verify the app.";

  const buttons = "[data-copy], #copy, #shcopy2, #shcopy, [data-wincopy], [data-beta-access]";
  document.querySelectorAll(buttons).forEach((button) => {
    const label = button.querySelector("span");
    const text = button.closest("nav") ? "Copy prompt" : "Copy prompt for your agent";
    if (label) label.textContent = text;
    else if (button.matches("[data-beta-access]")) button.textContent = text;
  });
  document.querySelectorAll(".body.prompt").forEach((node) => (node.textContent = prompt));
  document.addEventListener(
    "click",
    async (event) => {
      const button = event.target.closest?.(buttons);
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const label = button.querySelector("span") || button;
      try {
        if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(prompt);
        else {
          const field = document.createElement("textarea");
          field.value = prompt;
          document.body.append(field);
          field.select();
          const copied = document.execCommand("copy");
          field.remove();
          if (!copied) throw Error("copy");
        }
        label.textContent = "Copied";
        button.classList.add("done");
        document.getElementById("next")?.classList.add("on");
        const hero = document.getElementById("hero-cta");
        if (hero) hero.style.display = "none";
        const under = document.getElementById("under");
        if (under) under.style.display = "none";
        setTimeout(() => {
          label.textContent = button.closest("nav") ? "Copy prompt" : "Copy prompt for your agent";
          button.classList.remove("done");
        }, 2500);
      } catch {
        label.textContent = button.closest("nav") ? "Copy failed" : "Copy failed — select the prompt";
        document.getElementById("next")?.classList.add("on");
      }
    },
    true,
  );
  const roadmap = document.getElementById("roadmap");
  if (roadmap) {
    const buttons = [...roadmap.querySelectorAll("[data-vote]")],
      message = roadmap.querySelector('[role="status"]'),
      retry = roadmap.querySelector("[data-vote-retry]");
    const choices = new Map();
    let ready = false,
      pending = null,
      busy = false;
    function lock(value) {
      buttons.forEach((button) => (button.disabled = value));
      retry.disabled = value;
    }
    function apply(result) {
      if (!result || !Array.isArray(result.votes) || result.votes.length !== 3) throw Error("save");
      const seen = new Set();
      for (const vote of result.votes) {
        if (
          !vote ||
          !["eu", "iso27001", "soc2"].includes(vote.feature) ||
          ![null, "up", "down"].includes(vote.choice) ||
          seen.has(vote.feature)
        )
          throw Error("save");
        seen.add(vote.feature);
      }
      for (const vote of result.votes) choices.set(vote.feature, vote.choice);
      buttons.forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(choices.get(button.dataset.f) === button.dataset.vote),
        ),
      );
    }
    async function load() {
      if (busy) return;
      busy = true;
      lock(true);
      message.textContent = "Loading your votes…";
      try {
        const response = await fetch("/want", { cache: "no-store" });
        if (!response.ok) throw Error(response.status === 429 ? "rate" : "save");
        apply(await response.json());
        ready = true;
        message.textContent = "";
        retry.hidden = true;
      } catch (error) {
        message.textContent =
          error.message === "rate"
            ? "Please wait a minute, then retry."
            : "Your votes could not be loaded. Please retry.";
        retry.hidden = false;
      } finally {
        busy = false;
        lock(!ready);
        retry.disabled = false;
      }
    }
    async function save() {
      if (!pending || busy) return;
      busy = true;
      lock(true);
      message.textContent = "Saving your vote…";
      try {
        const response = await fetch("/want", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(pending),
        });
        if (!response.ok)
          throw Error(
            response.status === 429 ? "rate" : response.status === 409 ? "reload" : "save",
          );
        const result = await response.json();
        if (result.accepted !== true) throw Error("save");
        apply(result);
        pending = null;
        retry.hidden = true;
        message.textContent = "Vote saved. Thank you.";
      } catch (error) {
        message.textContent =
          error.message === "rate"
            ? "Please wait a minute, then retry."
            : error.message === "reload"
              ? "Your browser could not remember this vote. Allow site cookies and reload."
              : "Your vote was not confirmed. Please retry.";
        retry.hidden = false;
      } finally {
        busy = false;
        lock(false);
      }
    }
    roadmap.addEventListener("click", (event) => {
      const button = event.target.closest?.("[data-vote]");
      if (!button || !ready || busy) return;
      event.preventDefault();
      if (pending) {
        message.textContent = "Retry the unconfirmed vote before changing it.";
        retry.hidden = false;
        retry.focus();
        return;
      }
      pending = {
        feature: button.dataset.f,
        choice: choices.get(button.dataset.f) === button.dataset.vote ? null : button.dataset.vote,
        idempotency_key: crypto.randomUUID(),
      };
      void save();
    });
    retry.addEventListener("click", () => {
      if (pending) void save();
      else void load();
    });
    void load();
  }
  const status = document.getElementById("service-status");
  if (status)
    fetch("/status.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw Error("status");
        return response.json();
      })
      .then((result) => {
        status.replaceChildren();
        for (const component of result.components) {
          const row = document.createElement("p");
          row.textContent = component.name + ": " + component.status.replaceAll("_", " ");
          status.append(row);
        }
        const time = document.createElement("p");
        time.textContent = "Checked " + result.observed_at;
        status.append(time);
      })
      .catch(() => (status.textContent = "Status is temporarily unavailable. Please retry."));
})();
