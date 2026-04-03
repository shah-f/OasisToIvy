document.documentElement.classList.add("js");

const currentPage = window.location.pathname.split("/").pop() || "index.html";

document.querySelectorAll("[data-nav]").forEach((link) => {
  const isActive = link.getAttribute("href") === currentPage;
  link.classList.toggle("is-active", isActive);
  if (isActive) {
    link.setAttribute("aria-current", "page");
  }
});

const menu = document.querySelector("[data-menu]");
const toggle = document.querySelector("[data-menu-toggle]");

function closeMenu() {
  if (!menu || !toggle) return;
  menu.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
}

if (menu && toggle) {
  toggle.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("menu-open", open);
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      closeMenu();
    }
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -24px 0px",
  }
);

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

document.querySelectorAll(".signal-tabs").forEach((tablist) => {
  const tabs = Array.from(tablist.querySelectorAll("[data-signal-tab]"));
  const card = tablist.closest(".hero-card");
  const panels = Array.from(card?.querySelectorAll("[data-signal-panel]") || []);

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-signal-tab");

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        const active = panel.getAttribute("data-signal-panel") === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
});

document.querySelectorAll("[data-switcher]").forEach((switcher) => {
  const tabs = Array.from(switcher.querySelectorAll("[data-switcher-tab]"));
  const panels = Array.from(switcher.querySelectorAll("[data-switcher-panel]"));

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.getAttribute("data-switcher-tab");

      tabs.forEach((item) => {
        const active = item === tab;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-selected", String(active));
      });

      panels.forEach((panel) => {
        const active = panel.getAttribute("data-switcher-panel") === target;
        panel.classList.toggle("is-active", active);
        panel.hidden = !active;
      });
    });
  });
});

document.querySelectorAll("[data-tilt-card]").forEach((card) => {
  const reset = () => {
    card.style.transform = "";
  };

  card.addEventListener("pointermove", (event) => {
    if (window.innerWidth < 980) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 6;
    const rotateX = (0.5 - y) * 5;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", reset);
  card.addEventListener("blur", reset, true);
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const status = form.querySelector("[data-contact-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const organization = String(data.get("organization") || "").trim();
    const subject = String(data.get("subject") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !subject || !message) {
      if (status) status.textContent = "Please complete name, subject, and message.";
      return;
    }

    const mailboxUser = ["foram", "shah", "2006"].join("");
    const mailboxHost = ["gmail", "com"].join(".");
    const recipient = `${mailboxUser}@${mailboxHost}`;
    const lines = [
      `Name: ${name}`,
      organization ? `Organization: ${organization}` : null,
      "",
      message,
    ].filter(Boolean);
    const draftUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
      lines.join("\n")
    )}`;

    if (status) status.textContent = "Opening your email app...";
    window.location.href = draftUrl;
  });
});
