(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onReady(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  onReady(() => {
    if (reduceMotion) {
      document.body.classList.add("is-loaded");
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => document.body.classList.add("is-loaded"), 40);
      });
    }
  });

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      toggle.querySelector("i")?.classList.toggle("fa-bars", !open);
      toggle.querySelector("i")?.classList.toggle("fa-xmark", open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 1023px)").matches) {
          nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.setAttribute("aria-label", "Open menu");
          const icon = toggle.querySelector("i");
          icon?.classList.add("fa-bars");
          icon?.classList.remove("fa-xmark");
        }
      });
    });
  }

  document.querySelectorAll(".service-item").forEach((item) => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".service-item").forEach((el) => el.classList.remove("is-active"));
      item.classList.add("is-active");
    });
  });

  const filterPills = document.querySelectorAll(".filter-pill");
  const workCards = document.querySelectorAll(".repos-grid .repo-card");

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.getAttribute("data-filter");
      filterPills.forEach((p) => {
        p.classList.toggle("is-active", p === pill);
        p.setAttribute("aria-selected", p === pill ? "true" : "false");
      });

      workCards.forEach((card) => {
        const cats = (card.getAttribute("data-category") || "").split(/\s+/).filter(Boolean);
        const show = filter === "all" || cats.includes(filter);

        if (!show) {
          if (!card.classList.contains("is-hidden")) {
            if (reduceMotion) {
              card.classList.add("is-hidden");
            } else {
              card.classList.add("is-hiding");
              window.setTimeout(() => {
                card.classList.add("is-hidden");
                card.classList.remove("is-hiding", "is-entering");
              }, 320);
            }
          }
        } else {
          card.classList.remove("is-hiding");
          card.classList.remove("is-hidden");
          if (!reduceMotion) {
            card.classList.remove("is-entering");
            void card.offsetWidth;
            card.classList.add("is-entering");
            window.setTimeout(() => card.classList.remove("is-entering"), 580);
          }
        }
      });
    });
  });

  document.querySelector(".contact-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Thanks — this is a static demo. Connect the form to your backend or Formspree.");
  });

  const revealSelector = [
    ".section-head",
    ".service-item",
    ".filter-pill",
    ".work-card",
    ".repo-card",
    ".github-readme",
    ".github-figure",
    ".timeline-item",
    ".col-title",
    ".skill-card",
    ".blog-card",
    ".contact-aside",
    ".contact-form .field",
    ".contact-form .btn-block",
    ".footer-inner > *",
  ].join(",");

  document.querySelectorAll(revealSelector).forEach((el) => el.classList.add("reveal"));

  document.querySelectorAll("main section.section, footer.site-footer").forEach((scope) => {
    scope.querySelectorAll(".reveal").forEach((el, i) => {
      el.style.setProperty("--reveal-delay", `${Math.min(i, 12) * 0.055}s`);
    });
  });

  if (!reduceMotion) {
    const revealIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIo.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => revealIo.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  function formatK(value) {
    if (value <= 0) return "0";
    const k = value / 1000;
    const rounded = Math.round(k * 10) / 10;
    const s = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
    return s + "K";
  }

  function animateStat(el) {
    const end = parseFloat(el.getAttribute("data-value") || "0");
    const suffix = el.getAttribute("data-suffix") || "";
    const format = el.getAttribute("data-format");
    const duration = reduceMotion ? 0 : 1650;
    const start = performance.now();

    function frame(now) {
      if (duration === 0) {
        if (format === "k") el.textContent = formatK(end);
        else el.textContent = String(Math.round(end)) + suffix;
        return;
      }
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const cur = Math.round(eased * end);
      if (format === "k") {
        el.textContent = formatK(cur);
      } else {
        el.textContent = String(cur) + suffix;
      }
      if (t < 1) requestAnimationFrame(frame);
      else if (format === "k") el.textContent = formatK(end);
      else el.textContent = String(Math.round(end)) + suffix;
    }
    requestAnimationFrame(frame);
  }

  const statsBlock = document.querySelector("[data-stats-animate]");
  if (statsBlock) {
    let statsDone = false;
    const runStats = () => {
      if (statsDone) return;
      statsDone = true;
      statsBlock.querySelectorAll(".stat-num[data-value]").forEach((el) => animateStat(el));
    };

    if (reduceMotion) {
      runStats();
    } else {
      const statsIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runStats();
              statsIo.disconnect();
            }
          });
        },
        { threshold: 0.25 }
      );
      statsIo.observe(statsBlock);
    }
  }

  const glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches && window.matchMedia("(min-width: 900px)").matches) {
    window.addEventListener(
      "pointermove",
      (e) => {
        glow.style.left = e.clientX + "px";
        glow.style.top = e.clientY + "px";
      },
      { passive: true }
    );
  }

  if (!reduceMotion) {
    document.querySelectorAll(".work-card .work-thumb").forEach((thumb) => {
      thumb.addEventListener("mousemove", (e) => {
        const r = thumb.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        thumb.style.transform = `perspective(1000px) rotateY(${px * -6}deg) rotateX(${py * 6}deg) scale3d(1.02, 1.02, 1)`;
      });
      thumb.addEventListener("mouseleave", () => {
        thumb.style.transform = "";
      });
    });

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  const siteHeader = document.querySelector(".site-header");
  const scrollProgressBar = document.querySelector(".scroll-progress-bar");
  let scrollTicking = false;

  function updateScrollUi() {
    const y = window.scrollY || document.documentElement.scrollTop;
    if (siteHeader) {
      siteHeader.classList.toggle("is-scrolled", y > 28);
    }
    if (scrollProgressBar) {
      const docEl = document.documentElement;
      const maxScroll = docEl.scrollHeight - window.innerHeight;
      const pct = maxScroll > 0 ? Math.min(100, Math.max(0, (y / maxScroll) * 100)) : 0;
      scrollProgressBar.style.width = pct + "%";
    }
    scrollTicking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(updateScrollUi);
      }
    },
    { passive: true }
  );
  updateScrollUi();
})();
