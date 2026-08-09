/* ==========================================================
   PROJECT DATA
   Each project holds an ARRAY of images. The first image is
   the gallery thumbnail. Add a project by copying one block.
   ========================================================== */
const projects = [
  {
    category: "logo",
    title: "Cedar & Co. Logo",
    description: "A minimal wordmark logo for a boutique furniture brand.",
    images: ["images/Baby stroll.jpg", "images/Baby shop mockup.jpg"]
  },
  {
    category: "branding",
    title: "Willow Studio Branding",
    description: "Full brand identity including logo, color system, and stationery.",
    images: ["images/Nova logo.jpg", "images/NOVA Coffee Shop Branding Mockup.jpg"]
  },
  {
    category: "banner",
    title: "Instagram Banner",
    description: "A bold social banner made for a product launch campaign.",
    images: ["images/instagram-banner.jpg"]
  },
  {
    category: "poster",
    title: "Event Poster",
    description: "A vibrant poster designed for a local live music event.",
    images: ["images/event-poster-1.jpg", "images/event-poster-2.jpg"]
  },
  {
    category: "cover",
    title: "Podcast Cover Art",
    description: "Cover artwork designed for a weekly design podcast.",
    images: ["images/podcast-cover.jpg"]
  },
  {
    category: "tshirt",
    title: "Streetwear Graphic Tee",
    description: "A graphic tee design inspired by 90s skate culture.",
    images: ["images/streetwear-tee-front.jpg", "images/streetwear-tee-back.jpg"]
  },
  {
    category: "packaging",
    title: "Tea Tin Packaging",
    description: "Packaging design for a small-batch specialty tea brand.",
    images: ["images/tea-packaging-1.jpg", "images/tea-packaging-2.jpg"]
  },
  {
    category: "illustration",
    title: "Retro Sunset Illustration",
    description: "A hand-built vector illustration in a Y2K poster style.",
    images: ["images/illustration-1.jpg"]
  },
  {
    category: "uiux",
    title: "Fitness App Concept",
    description: "A mobile app UI concept exploring a bold, playful visual system.",
    images: ["images/uiux-1.jpg", "images/uiux-2.jpg", "images/uiux-3.jpg"]
  },
  {
    category: "photography",
    title: "Product Shoot — Ceramics",
    description: "Product photography and light retouching for a ceramics shop.",
    images: ["images/photo-1.jpg", "images/photo-2.jpg"]
  }
];

/* ==========================================================
   BUILD GALLERY CARDS FROM THE DATA ABOVE
   ========================================================== */
const gallery = document.getElementById("gallery");

projects.forEach(function (project, index) {
  const card = document.createElement("div");
  card.classList.add("card", "reveal");
  card.setAttribute("data-category", project.category);
  card.setAttribute("data-index", index);

  const countLabel = project.images.length > 1
    ? '<span class="card-count">' + project.images.length + ' images</span>'
    : "";

  card.innerHTML =
    '<span class="card-number">' + String(index + 1).padStart(2, "0") + '</span>' +
    '<img class="thumb" src="' + project.images[0] + '" alt="' + project.title + '">' +
    '<p class="card-title">' + project.title + '</p>' +
    countLabel;

  gallery.appendChild(card);
});

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".card");

/* ==========================================================
   CARD FILTERING
   ========================================================== */
filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    const selectedCategory = button.getAttribute("data-filter");

    cards.forEach(function (card) {
      const cardCategory = card.getAttribute("data-category");

      if (selectedCategory === "all" || selectedCategory === cardCategory) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });

  });
});

/* ==========================================================
   LIGHTBOX / MODAL — multi-image + full-size viewer
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
const fullsizeBtn = document.getElementById("fullsize-btn");

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

  const hasMultiple = currentProject.images.length > 1;
  modalPrev.classList.toggle("hidden", !hasMultiple);
  modalNext.classList.toggle("hidden", !hasMultiple);

  renderDots();
}

function renderDots() {
  modalDots.innerHTML = "";

  if (currentProject.images.length <= 1) {
    return;
  }

  currentProject.images.forEach(function (image, i) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    if (i === currentImageIndex) {
      dot.classList.add("active");
    }
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
  modal.classList.remove("fullsize");
  fullsizeBtn.textContent = "\u2721 Full Size";
}

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    const projectIndex = card.getAttribute("data-index");
    openLightbox(projects[projectIndex]);
  });
});

modalNext.addEventListener("click", showNextImage);
modalPrev.addEventListener("click", showPrevImage);

/* Full-size toggle — via the toolbar button OR clicking the image itself */
function toggleFullsize() {
  const isFullsize = modal.classList.toggle("fullsize");
  fullsizeBtn.textContent = isFullsize ? "\u2716 Exit Full Size" : "\u2721 Full Size";
}

fullsizeBtn.addEventListener("click", toggleFullsize);
modalThumb.addEventListener("click", toggleFullsize);

/* Keyboard navigation */
document.addEventListener("keydown", function (event) {
  if (!modal.classList.contains("open")) {
    return;
  }
  if (event.key === "ArrowRight") {
    showNextImage();
  } else if (event.key === "ArrowLeft") {
    showPrevImage();
  } else if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "f" || event.key === "F") {
    toggleFullsize();
  }
});

/* Mobile swipe navigation */
let touchStartX = 0;

modalViewer.addEventListener("touchstart", function (event) {
  touchStartX = event.touches[0].clientX;
});

modalViewer.addEventListener("touchend", function (event) {
  const touchEndX = event.changedTouches[0].clientX;
  const distance = touchStartX - touchEndX;
  const SWIPE_THRESHOLD = 50;

  if (Math.abs(distance) > SWIPE_THRESHOLD) {
    if (distance > 0) {
      showNextImage();
    } else {
      showPrevImage();
    }
  }
});

modalClose.addEventListener("click", closeLightbox);

modal.addEventListener("click", function (event) {
  if (event.target === modal) {
    closeLightbox();
  }
});

/* ==========================================================
   SCROLL REVEAL ANIMATION
   ========================================================== */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.2
});

revealElements.forEach(function (el) {
  revealObserver.observe(el);
});

/* ==========================================================
   SCROLL DIRECTION + SCROLL-LINKED INTERACTIONS

   Everything here is written as a function of the CURRENT
   scroll value (scrollY), never as a one-off "play once"
   animation. That's what makes it automatically reverse when
   the user scrolls back up — there's no separate "undo"
   animation to write, the same formula just produces a
   smaller number as scrollY decreases.
   ========================================================== */
const decoShapes = document.querySelectorAll(".deco-shape");
const checkerStrip = document.getElementById("checker-strip");
const navbar = document.getElementById("navbar");
const sunScene = document.getElementById("sun-scene");
const heroTitle = document.getElementById("hero-title");

let lastScrollY = window.scrollY;
let scrollSettleTimer = null;

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const scrollDelta = scrollY - lastScrollY; // positive = scrolling down

  /* Track direction on <body> so CSS can react (e.g. marquee direction) */
  document.body.setAttribute("data-scroll-dir", scrollDelta >= 0 ? "down" : "up");

  /* Parallax + rotation for every decorative sticker/shape */
  decoShapes.forEach(function (shape) {
    const speed = parseFloat(shape.getAttribute("data-speed")) || 0.2;
    const rotateSpeed = parseFloat(shape.getAttribute("data-rotate")) || 0;
    const offset = scrollY * speed;
    const rotation = scrollY * rotateSpeed;
    shape.style.transform = "translateY(" + offset + "px) rotate(" + rotation + "deg)";
  });

  /* Checkerboard floor slides sideways with scroll position */
  if (checkerStrip) {
    checkerStrip.style.backgroundPosition =
      (scrollY * 0.3) + "px 0, " + (scrollY * 0.3 + 11) + "px 11px";
  }

  /* Navbar compacts once scrolled past 60px */
  if (navbar) {
    navbar.classList.toggle("scrolled", scrollY > 60);
  }

  /* Sun scene drifts through a hue-rotate based on overall page progress */
  if (sunScene) {
    const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = pageHeight > 0 ? scrollY / pageHeight : 0;
    sunScene.style.filter = "hue-rotate(" + (progress * 60) + "deg)";
  }

  /* Headline reacts to scroll VELOCITY: fast scroll = quick skew "wobble",
     which settles back to 0 automatically once scrolling stops */
  if (heroTitle) {
    const skew = Math.max(-6, Math.min(6, scrollDelta * 0.5));
    heroTitle.style.transform = "skewY(" + skew + "deg)";
  }

  lastScrollY = scrollY;

  /* After scrolling stops for 150ms, ease the headline skew back to 0 */
  clearTimeout(scrollSettleTimer);
  scrollSettleTimer = setTimeout(function () {
    if (heroTitle) {
      heroTitle.style.transform = "skewY(0deg)";
    }
  }, 150);
}

window.addEventListener("scroll", updateScrollEffects);
updateScrollEffects();

/* ==========================================================
   SPLASH SCREEN
   ========================================================== */
const splash = document.getElementById("splash");
const splashEnter = document.getElementById("splash-enter");

splashEnter.addEventListener("click", function () {
  splash.classList.add("closed");
});

/* ==========================================================
   SCROLL TO TOP BUTTON
   ========================================================== */
const scrollTopBtn = document.getElementById("scroll-top");

window.addEventListener("scroll", function () {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ==========================================================
   FOOTER YEAR
   ========================================================== */
document.getElementById("year").textContent = new Date().getFullYear();
