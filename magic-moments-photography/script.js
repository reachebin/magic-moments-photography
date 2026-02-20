// ===== Header elevation on scroll
const header = document.querySelector("[data-elevate]");
const yearEl = document.getElementById("year");
yearEl.textContent = new Date().getFullYear();

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

  // Close on nav click (mobile)
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
const tiles = document.querySelectorAll(".tile");

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

// ===== Lightbox
const lightbox = document.querySelector("[data-lightbox]");
const lbImg = document.querySelector("[data-lightbox-img]");
const lbClose = document.querySelector("[data-lightbox-close]");

function openLightbox(src, alt) {
  if (!lightbox || !lbImg) return;
  lbImg.src = src;
  lbImg.alt = alt || "Expanded image";
  lightbox.hidden = false;
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lbImg) return;
  lightbox.hidden = true;
  lightbox.setAttribute("aria-hidden", "true");
  lbImg.src = "";
  document.body.style.overflow = "";
}

tiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    const img = tile.querySelector("img");
    if (!img) return;
    openLightbox(img.currentSrc || img.src, img.alt);
  });
});

lbClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

// ===== Testimonials slider (edit these)
const testimonials = [
  {
    title: "Comfortable, natural, and beautiful.",
    text: "We felt so at ease the entire time. The photos look like us — not overly posed — and every moment feels real.",
    by: "— Client Name"
  },
  {
    title: "Timeless storytelling.",
    text: "Our gallery brought everything back instantly. The details, the emotions, the little candid moments — all captured perfectly.",
    by: "— Client Name"
  },
  {
    title: "Professional and organized.",
    text: "From planning to delivery, everything was smooth. Communication was clear and the final images were stunning.",
    by: "— Client Name"
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
