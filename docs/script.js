document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

const header = document.querySelector("[data-elevate]");
const yearEl = document.getElementById("year");
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("siteNav");
const heroMedia = document.querySelector(".hero__media");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function onScroll() {
  if (header) {
    header.classList.toggle("is-elevated", window.scrollY > 8);
  }
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node)) return;

    if (!nav.contains(target) && !navToggle.contains(target)) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const staggerGroups = Array.from(document.querySelectorAll("[data-stagger]"));
staggerGroups.forEach((group) => {
  const revealChildren = Array.from(group.querySelectorAll("[data-reveal]"));
  revealChildren.forEach((element, index) => {
    if (element.hasAttribute("data-reveal-delay")) return;
    element.style.setProperty("--reveal-delay", `${index * 70}ms`);
  });
});

const revealElements = Array.from(document.querySelectorAll("[data-reveal]"));
revealElements.forEach((element) => {
  const customDelay = element.getAttribute("data-reveal-delay");
  if (customDelay) {
    element.style.setProperty("--reveal-delay", `${customDelay}ms`);
  }
});

function revealAll() {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

if (heroMedia && !prefersReducedMotion) {
  let ticking = false;

  const updateParallax = () => {
    const offset = Math.min(window.scrollY * 0.12, 44);
    heroMedia.style.transform = `scale(1.04) translate3d(0, ${offset}px, 0)`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    },
    { passive: true }
  );
}

const chips = Array.from(document.querySelectorAll(".chip"));
const tiles = Array.from(document.querySelectorAll(".tile"));
const filterStatus = document.querySelector("[data-filter-status]");

function getVisibleTiles() {
  return tiles.filter((tile) => !tile.classList.contains("is-hidden"));
}

function categoryLabel(filter) {
  if (filter === "all") return "all images";
  if (filter === "singles") return "portrait images";
  return `${filter} images`;
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((button) => {
      button.classList.remove("is-active");
      button.setAttribute("aria-selected", "false");
    });

    chip.classList.add("is-active");
    chip.setAttribute("aria-selected", "true");

    const filter = chip.dataset.filter || "all";
    let visibleCount = 0;

    tiles.forEach((tile) => {
      const matches = filter === "all" || tile.dataset.category === filter;
      tile.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });

    if (filterStatus) {
      filterStatus.textContent = `Showing ${visibleCount} ${categoryLabel(filter)}.`;
    }
  });
});

const lightbox = document.querySelector("[data-lightbox]");
const lbImg = document.querySelector("[data-lightbox-img]");
const lbClose = document.querySelector("[data-lightbox-close]");
const lbPrev = document.querySelector("[data-lightbox-prev]");
const lbNext = document.querySelector("[data-lightbox-next]");
const lbCounter = document.querySelector("[data-lightbox-counter]");

let activeIndex = -1;
let touchStartX = 0;
let touchEndX = 0;

function setLightboxImage() {
  const visibleTiles = getVisibleTiles();
  if (!lbImg || !visibleTiles.length || activeIndex < 0) return;

  if (activeIndex >= visibleTiles.length) activeIndex = 0;
  if (activeIndex < 0) activeIndex = visibleTiles.length - 1;

  const activeTile = visibleTiles[activeIndex];
  const image = activeTile.querySelector("img");
  if (!image) return;

  lbImg.src = image.src;
  lbImg.alt = image.alt || "Expanded gallery image";

  if (lbCounter) {
    lbCounter.textContent = `${activeIndex + 1} / ${visibleTiles.length}`;
  }

  const disableNav = visibleTiles.length <= 1;
  if (lbPrev) lbPrev.disabled = disableNav;
  if (lbNext) lbNext.disabled = disableNav;
}

function openLightbox(index) {
  const visibleTiles = getVisibleTiles();
  if (!lightbox || !lbImg || !visibleTiles.length) return;

  activeIndex = index;
  setLightboxImage();
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  if (!lightbox || !lbImg) return;

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lbImg.removeAttribute("src");
  activeIndex = -1;
  document.body.classList.remove("lightbox-open");
}

function showPrev() {
  const visibleTiles = getVisibleTiles();
  if (!visibleTiles.length) return;
  activeIndex = (activeIndex - 1 + visibleTiles.length) % visibleTiles.length;
  setLightboxImage();
}

function showNext() {
  const visibleTiles = getVisibleTiles();
  if (!visibleTiles.length) return;
  activeIndex = (activeIndex + 1) % visibleTiles.length;
  setLightboxImage();
}

tiles.forEach((tile) => {
  tile.setAttribute("tabindex", "0");
  tile.addEventListener("click", () => {
    const visibleTiles = getVisibleTiles();
    const clickedIndex = visibleTiles.indexOf(tile);
    if (clickedIndex === -1) return;
    openLightbox(clickedIndex);
  });

  tile.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    const visibleTiles = getVisibleTiles();
    const clickedIndex = visibleTiles.indexOf(tile);
    if (clickedIndex === -1) return;
    openLightbox(clickedIndex);
  });
});

if (lbClose) lbClose.addEventListener("click", closeLightbox);
if (lbPrev) {
  lbPrev.addEventListener("click", (event) => {
    event.stopPropagation();
    showPrev();
  });
}
if (lbNext) {
  lbNext.addEventListener("click", (event) => {
    event.stopPropagation();
    showNext();
  });
}

if (lightbox) {
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightbox.addEventListener(
    "touchstart",
    (event) => {
      if (!event.changedTouches || !event.changedTouches.length) return;
      touchStartX = event.changedTouches[0].clientX;
    },
    { passive: true }
  );

  lightbox.addEventListener(
    "touchend",
    (event) => {
      if (!event.changedTouches || !event.changedTouches.length) return;
      touchEndX = event.changedTouches[0].clientX;
      const difference = touchStartX - touchEndX;

      if (Math.abs(difference) > 50) {
        if (difference > 0) {
          showNext();
        } else {
          showPrev();
        }
      }
    },
    { passive: true }
  );
}

document.addEventListener("keydown", (event) => {
  if (!lightbox || lightbox.hidden) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowLeft") showPrev();
  if (event.key === "ArrowRight") showNext();
});

const contactForm = document.querySelector("[data-mailto-form]");
if (contactForm instanceof HTMLFormElement) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const sessionType = String(formData.get("sessionType") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const subject = sessionType
      ? `Photography inquiry - ${sessionType}`
      : "Photography inquiry";

    const body = [
      `Name: ${name || "-"}`,
      `Email: ${email || "-"}`,
      `Date: ${date || "-"}`,
      `Location: ${location || "-"}`,
      `Session type: ${sessionType || "-"}`,
      "",
      "Message:",
      message || "-"
    ].join("\n");

    window.location.href = `mailto:info@mmphotographi.ca?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}
