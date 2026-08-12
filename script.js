/* ==========================================================
   PROJECT DATA
   Categories now match the brief's filters exactly:
   logos, branding, social, print, merch.
   Each project holds an array of images (first = thumbnail).
   ========================================================== */
const projects = [
  {
    category: "logo",
    title: "Cedar & Co. Logo",
    description: "A minimal wordmark logo for a boutique furniture brand.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "branding",
    title: "Willow Studio Branding",
    description: "Full brand identity including logo, color system, and stationery.",
    images: ["images/nova_logo.jpg", "images/mockup2.jpg"]
  },
  {
    category: "banner",
    title: "Instagram Banner",
    description: "A bold social banner made for a product launch campaign.",
    images: ["images/ember_logo.png", "images/mockup3.jpg"]
  },
  {
    category: "poster",
    title: "Event Poster",
    description: "A vibrant poster designed for a local live music event.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "cover",
    title: "Podcast Cover Art",
    description: "Cover artwork designed for a weekly design podcast.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "tshirt",
    title: "Streetwear Graphic Tee",
    description: "A graphic tee design inspired by 90s skate culture.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "packaging",
    title: "Tea Tin Packaging",
    description: "Packaging design for a small-batch specialty tea brand.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "illustration",
    title: "Retro Sunset Illustration",
    description: "A hand-built vector illustration in a Y2K poster style.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "uiux",
    title: "Fitness App Concept",
    description: "A mobile app UI concept exploring a bold, playful visual system.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  },
  {
    category: "photography",
    title: "Product Shoot — Ceramics",
    description: "Product photography and light retouching for a ceramics shop.",
    images: ["images/baby_logo.jpg", "images/mockup1.jpg"]
  }
];

/* ==========================================================
   BUILD GALLERY CARDS
   Text-only by design: category, title, optional short description,
   and an arrow. No project image renders here — cards are sized by
   their own content, never by an uploaded image's dimensions, so
   new projects always slot in cleanly with no gaps or cropping.
   ========================================================== */
const gallery = document.getElementById("gallery");

projects.forEach(function (project, index) {
  const card = document.createElement("div");
  card.classList.add("card", "reveal");
  card.setAttribute("data-category", project.category);
  card.setAttribute("data-index", index);

  card.innerHTML =
    '<p class="card-cat">' + project.category + '</p>' +
    '<div>' +
      '<div class="card-title-row">' +
        '<p class="card-title">' + project.title + '</p>' +
        '<span class="card-arrow">&rarr;</span>' +
      '</div>' +
    '</div>';

  gallery.appendChild(card);
});

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

/* ==========================================================
   FILTERING
   ========================================================== */
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    filterButtons.forEach(function (btn) { btn.classList.remove("active"); });
    button.classList.add("active");

    const selected = button.getAttribute("data-filter");

    cards.forEach(function (card) {
      const cat = card.getAttribute("data-category");
      card.style.display = (selected === "all" || selected === cat) ? "block" : "none";
    });
  });
});

/* ==========================================================
   LIGHTBOX — image presentation is fully decoupled from the card
   grid. The modal always shows the complete image at its natural
   aspect ratio (object-fit: contain in CSS), so there's no "full
   size" mode to toggle — this IS the normal view now.
   ========================================================== */
const modal = document.getElementById("modal");
const modalViewer = document.getElementById("modal-viewer");
const modalThumb = document.getElementById("modal-thumb");
const modalTitle = document.getElementById("modal-title");
const modalCategory = document.getElementById("modal-category");
const modalDescription = document.getElementById("modal-description");
const modalClose = document.getElementById("modal-close");
const modalPrev = document.getElementById("modal-prev");
const modalNext = document.getElementById("modal-next");
const modalDots = document.getElementById("modal-dots");

let currentProject = null;
let currentImageIndex = 0;

function openLightbox(project) {
  currentProject = project;
  currentImageIndex = 0;
  modalTitle.textContent = project.title;
  modalCategory.textContent = project.category;
  modalDescription.textContent = project.description;
  renderImage();
  modal.classList.add("open");
}

function renderImage() {
  const image = currentProject.images[currentImageIndex];
  modalThumb.src = image;
  modalThumb.alt = currentProject.title;

  const hasMultiple = currentProject.images.length > 1;
  modalPrev.classList.toggle("hidden", !hasMultiple);
  modalNext.classList.toggle("hidden", !hasMultiple);
  renderDots();
}

function renderDots() {
  modalDots.innerHTML = "";
  if (currentProject.images.length <= 1) return;

  currentProject.images.forEach(function (img, i) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentImageIndex) dot.classList.add("active");
    modalDots.appendChild(dot);
  });
}

function showNextImage() {
  const total = currentProject.images.length;
  currentImageIndex = (currentImageIndex + 1) % total;
  renderImage();
}

function showPrevImage() {
  const total = currentProject.images.length;
  currentImageIndex = (currentImageIndex - 1 + total) % total;
  renderImage();
}

function closeLightbox() {
  modal.classList.remove("open");
}

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    openLightbox(projects[card.getAttribute("data-index")]);
  });
});

modalNext.addEventListener("click", showNextImage);
modalPrev.addEventListener("click", showPrevImage);
modalClose.addEventListener("click", closeLightbox);

modal.addEventListener("click", function (event) {
  if (event.target === modal) closeLightbox();
});

document.addEventListener("keydown", function (event) {
  if (!modal.classList.contains("open")) return;
  if (event.key === "ArrowRight") showNextImage();
  else if (event.key === "ArrowLeft") showPrevImage();
  else if (event.key === "Escape") closeLightbox();
});

let touchStartX = 0;
modalViewer.addEventListener("touchstart", function (e) { touchStartX = e.touches[0].clientX; });
modalViewer.addEventListener("touchend", function (e) {
  const dist = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dist) > 50) { dist > 0 ? showNextImage() : showPrevImage(); }
});

/* ==========================================================
   SCROLL REVEAL — single restrained fade-up
   ========================================================== */
const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach(function (el) {
  revealObserver.observe(el);
});

/* ==========================================================
   CASE STUDY IMAGE FALLBACK — same idea as the gallery cards
   ========================================================== */
document.querySelectorAll(".case-media img").forEach(function (img) {
  img.addEventListener("error", function () {
    const wrapper = img.closest(".case-media");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "center";
    wrapper.style.background = "var(--line)";
    wrapper.style.height = "460px";
    wrapper.innerHTML = '<span style="font-size:13px;color:var(--ink-soft);font-weight:600;">Image not added yet</span>';
  });
});

/* ==========================================================
   NAVBAR — border appears once scrolled, nothing else moves
   ========================================================== */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", function () {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

/* ==========================================================
   FOOTER YEAR
   ========================================================== */
document.getElementById("year").textContent = new Date().getFullYear();
