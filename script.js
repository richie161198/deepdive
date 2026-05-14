const header = document.querySelector(".site-header");
const mobileBtn = document.querySelector(".mobile-nav-btn");
const nav = document.querySelector(".main-nav");

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 12);
});

mobileBtn?.addEventListener("click", () => {
  nav.classList.toggle("open");
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const slides = [...document.querySelectorAll(".hero-slide")];
const dots = [...document.querySelectorAll(".dot")];
let current = 0;

function showSlide(index) {
  slides.forEach((slide, idx) => slide.classList.toggle("active", idx === index));
  dots.forEach((dot, idx) => dot.classList.toggle("active", idx === index));
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    current = index;
    showSlide(current);
  });
});

setInterval(() => {
  if (slides.length <= 1) return;
  current = (current + 1) % slides.length;
  showSlide(current);
}, 6500);

const tabs = [...document.querySelectorAll(".tab")];
const lists = [...document.querySelectorAll(".menu-list")];

if (tabs.length && lists.length) {
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tab;
      tabs.forEach((item) => item.classList.remove("active"));
      lists.forEach((list) => list.classList.remove("active"));
      tab.classList.add("active");
      document.querySelector(`[data-list="${target}"]`)?.classList.add("active");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -60px",
  }
);

revealElements.forEach((element) => observer.observe(element));

const parallaxItems = [...document.querySelectorAll("[data-parallax]")];

if (window.gsap && window.ScrollTrigger && parallaxItems.length) {
  gsap.registerPlugin(ScrollTrigger);

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.speed || 0.15);
    const travel = 220 * (0.6 + speed * 3);
    const state = { offset: -travel };

    gsap.to(state, {
      offset: travel,
      ease: "none",
      scrollTrigger: {
        trigger: item,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.15,
        invalidateOnRefresh: true,
      },
      onUpdate: () => {
        item.style.setProperty("--parallax-offset", `${state.offset.toFixed(2)}px`);
      },
    });
  });
} else {
  // Fallback if GSAP is unavailable.
  let isParallaxTicking = false;
  const PARALLAX_SPEED_MULTIPLIER = 1.9;
  const PARALLAX_MAX_OFFSET = 200;

  function applyParallax() {
    const viewportCenter = window.innerHeight / 2;

    parallaxItems.forEach((item) => {
      const speed = Number(item.dataset.speed || 0.15) * PARALLAX_SPEED_MULTIPLIER;
      const rect = item.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const distance = elementCenter - viewportCenter;
      const offset = Math.max(
        -PARALLAX_MAX_OFFSET,
        Math.min(PARALLAX_MAX_OFFSET, -distance * speed)
      );
      item.style.setProperty("--parallax-offset", `${offset.toFixed(2)}px`);
    });

    isParallaxTicking = false;
  }

  function queueParallax() {
    if (!isParallaxTicking) {
      requestAnimationFrame(applyParallax);
      isParallaxTicking = true;
    }
  }

  queueParallax();
  window.addEventListener("scroll", queueParallax, { passive: true });
  window.addEventListener("resize", queueParallax);
}

const footerYear = document.getElementById("footer-year");
if (footerYear) {
  footerYear.textContent = String(new Date().getFullYear());
}
