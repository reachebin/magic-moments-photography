// ===== Header elevation on scroll
const header = document.querySelector("[data-elevate]");
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

function onScroll() {
  if (!header) return;
  header.classList.toggle("is-elevated", window.scrollY > 6);
}
window.addEventListener("scroll", onScroll);
onScroll();

// ===== Mobile nav toggle
const navToggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("siteNav");

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.tagName === "A" && nav.classList.contains("is-open")) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== Dropdown (Info)
const dropdown = document.querySelector(".dropdown");
if (dropdown) {
  const btn = dropdown.querySelector(".dropdown__btn");

  btn?.addEventListener("click", () => {
    const isOpen = dropdown.classList.toggle("is-open");
    btn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("is-open");
      btn?.setAttribute("aria-expanded", "false");
    }
  });
}

// ===== Portfolio filters
const chips = document.querySelectorAll(".chip");
const tiles = Array.from(document.querySelectorAll(".tile"));

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((c) => {
      c.classList.remove("is-active");
      c.setAttribute("aria-selected", "false");
    });

    chip.classList.add("is-active");
    chip.setAttribute("aria-selected", "true");

    const filter = chip.dataset.filter || "all";

    tiles.forEach((tile) => {
      const cat = tile.dataset.category;
      const show = filter === "all" || cat === filter;
      tile.classList.toggle("is-hidden", !show);
    });
  });
});

// ===== Lightbox with previous / next navigation
const lightbox = document.querySelector("[data-lightbox]");
const lbImg = document.querySelector("[data-lightbox-img]");
const lbClose = document.querySelector("[data-lightbox-close]");
const lbPrev = document.querySelector("[data-lightbox-prev]");
const lbNext = document.querySelector("[data-lightbox-next]");

let activeIndex = -1;

function getVisibleTiles() {
  return tiles.filter((tile) => !tile.classList.contains("is-hidden"));
}

function updateLightboxImage() {
  const visibleTiles = getVisibleTiles();
  if (!lbImg || !visibleTiles.length || activeIndex < 0) return;

  if (activeIndex >= visibleTiles.length) {
    activeIndex = 0;
  }

  const activeTile = visibleTiles[activeIndex];
  const img = activeTile.querySelector("img");
  if (!img) return;

  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt || "Expanded image";

  const onlyOneImage = visibleTiles.length < 2;
  if (lbPrev) lbPrev.disabled = onlyOneImage;
  if (lbNext) lbNext.disabled = onlyOneImage;
}

function openLightboxByIndex(index) {
  const visibleTiles = getVisibleTiles();
  if (!lightbox || !lbImg || !visibleTiles.length) return;

  activeIndex = ((index % visibleTiles.length) + visibleTiles.length) % visibleTiles.length;
  updateLightboxImage();

  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lbImg) return;

  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lbImg.removeAttribute("src");
  document.body.style.overflow = "";
  activeIndex = -1;
}

function showPreviousImage() {
  const visibleTiles = getVisibleTiles();
  if (!visibleTiles.length) return;

  activeIndex = (activeIndex - 1 + visibleTiles.length) % visibleTiles.length;
  updateLightboxImage();
}

function showNextImage() {
  const visibleTiles = getVisibleTiles();
  if (!visibleTiles.length) return;

  activeIndex = (activeIndex + 1) % visibleTiles.length;
  updateLightboxImage();
}

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const visibleTiles = getVisibleTiles();
    const clickedIndex = visibleTiles.indexOf(tile);
    if (clickedIndex === -1) return;

    openLightboxByIndex(clickedIndex);
  });
});

lbClose?.addEventListener("click", closeLightbox);
lbPrev?.addEventListener("click", showPreviousImage);
lbNext?.addEventListener("click", showNextImage);

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (!lightbox || lightbox.hidden) return;

  if (e.key === "Escape") {
    closeLightbox();
  } else if (e.key === "ArrowLeft") {
    showPreviousImage();
  } else if (e.key === "ArrowRight") {
    showNextImage();
  }
});

// ===== Testimonials slider
const testimonials = [
  {
    title: "Comfortable, natural, and beautiful.",
    text: "We felt so at ease the entire time. The photos look like us — not overly posed — and every moment feels real.",
    by: "— Sarah & Daniel"
  },
  {
    title: "Timeless storytelling.",
    text: "Our gallery brought everything back instantly. The details, the emotions, the little candid moments — all captured perfectly.",
    by: "— Priya & Arun"
  },
  {
    title: "Professional and organized.",
    text: "From planning to delivery, everything was smooth. Communication was clear and the final images were stunning.",
    by: "— Emma Johnson"
  }
];

const viewport = document.querySelector("[data-slider-viewport]");
const prevBtn = document.querySelector("[data-prev]");
const nextBtn = document.querySelector("[data-next]");
let index = 0;

function renderTestimonial(i) {
  if (!viewport) return;
  const t = testimonials[i];

  viewport.innerHTML = `
    <div class="quote" aria-live="polite">
      <p class="quote__title">${t.title}</p>
      <p class="quote__text">“${t.text}”</p>
      <p class="quote__by">${t.by}</p>
    </div>
  `;
}

prevBtn?.addEventListener("click", () => {
  index = (index - 1 + testimonials.length) % testimonials.length;
  renderTestimonial(index);
});

nextBtn?.addEventListener("click", () => {
  index = (index + 1) % testimonials.length;
  renderTestimonial(index);
});

renderTestimonial(index);