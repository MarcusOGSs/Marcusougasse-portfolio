const sidebar = document.querySelector(".sidebar");
const topbar = document.querySelector(".topbar");

if (sidebar && topbar) {
  sidebar.id = "sidebar";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "menu-toggle";
  toggle.setAttribute("aria-controls", "sidebar");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Ouvrir le menu");
  toggle.innerHTML = "<span></span><span></span><span></span>";

  const backdrop = document.createElement("button");
  backdrop.type = "button";
  backdrop.className = "sidebar-backdrop";
  backdrop.setAttribute("aria-label", "Fermer le menu");
  document.body.appendChild(backdrop);

  const head = document.createElement("div");
  head.className = "page-head";
  const bar = document.createElement("div");
  bar.className = "mobile-bar";
  bar.append(sidebar.querySelector(".site-name").cloneNode(true), toggle);
  topbar.before(head);
  head.append(bar, topbar);

  const setOpen = (open) => {
    sidebar.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    document.body.classList.toggle("menu-open", open);
    if (open) document.body.appendChild(toggle);
    else bar.appendChild(toggle);
  };

  toggle.addEventListener("click", () => {
    setOpen(!sidebar.classList.contains("is-open"));
  });
  backdrop.addEventListener("click", () => setOpen(false));
  sidebar.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

const copyLink = document.querySelector(".copy-link");

if (copyLink) {
  const label = copyLink.querySelector("span");
  let timer = 0;

  const copyUrl = async (url) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        return true;
      }
    } catch {
      // Le presse-papiers peut être refusé hors contexte sécurisé.
    }

    try {
      const field = document.createElement("textarea");
      field.value = url;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.left = "-9999px";
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand("copy");
      field.remove();
      return copied;
    } catch {
      return false;
    }
  };

  copyLink.addEventListener("click", async () => {
    const copied = await copyUrl(window.location.href);
    if (!copied || !label) return;

    label.textContent = "Copied";
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      label.textContent = "Copy link";
    }, 1500);
  });
}
