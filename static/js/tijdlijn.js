// =============================
// SCROLL ANIMATIE TIJDLIJN
// =============================

document.addEventListener("DOMContentLoaded", () => {

  const timelineGroups = document.querySelectorAll(".timeline-group");
  let lastScrollY = window.scrollY;

  const observer = new IntersectionObserver(
    (entries) => {
      const scrollingDown = window.scrollY > lastScrollY;

      entries.forEach(entry => {
        if (entry.isIntersecting && scrollingDown) {
          entry.target.classList.add("visible");
        } else if (!entry.isIntersecting && !scrollingDown) {
          entry.target.classList.remove("visible");
        }
      });

      lastScrollY = window.scrollY;
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -30% 0px"
    }
  );

  timelineGroups.forEach(group => {
    observer.observe(group);
  });

});

// =============================
// NAVIGATION HOVER
// =============================

const links = document.querySelectorAll(".nav-links a");
const indicator = document.querySelector(".nav-indicator");

if (links.length && indicator) {
    let activeLink = document.querySelector(".nav-links a.active");

    function moveIndicator(link) {
        indicator.style.left = `${link.offsetLeft}px`;
        indicator.style.width = `${link.offsetWidth}px`;
    }

    moveIndicator(activeLink);

  links.forEach(link => {

      link.addEventListener("mouseenter", () => {

          if (activeLink && link !== activeLink) {
              activeLink.classList.add("temp-inactive");
          }

          moveIndicator(link);
      });

      link.addEventListener("mouseleave", () => {

          if (activeLink) {
              activeLink.classList.remove("temp-inactive");
          }

          moveIndicator(activeLink);
      });

  });
}

// =============================
// DONATIE STATS
// =============================

document.addEventListener("DOMContentLoaded", () => {

    const counters = document.querySelectorAll(".counter");

    const easeOutCubic = (t) => {
        return 1 - Math.pow(1 - t, 3);
    };

    const animateCounter = (counter) => {

        const target = parseInt(counter.dataset.target);
        const duration = 2500;

        let startTime = null;

        const updateCounter = (currentTime) => {

            if (!startTime) startTime = currentTime;

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const easedProgress = easeOutCubic(progress);
            const current = Math.floor(target * easedProgress);

            if (counter.classList.contains("money")) {
                counter.textContent =
                    "€" + current.toLocaleString("nl-NL");
            } else {
                counter.textContent =
                    current.toLocaleString("nl-NL");
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {

                if (counter.classList.contains("money")) {
                    counter.textContent =
                        "€" + target.toLocaleString("nl-NL");
                } else {
                    counter.textContent =
                        target.toLocaleString("nl-NL");
                }

            }

        };

        requestAnimationFrame(updateCounter);

    };

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }

        });

    }, {
        threshold: 0.3
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });

});

// =============================
// DONATIE TABS
// =============================

const tabs = document.querySelectorAll(".donatie-tabs p");
const tabIndicator = document.querySelector(".tab-indicator");

if (tabs.length && tabIndicator) {

    let activeTab = document.querySelector(".donatie-tabs p.active");

    // fallback als er geen active staat in HTML
    if (!activeTab) {
        activeTab = tabs[0];
        activeTab.classList.add("active");
    }

    function moveTabIndicator(tab) {
        const parentRect = tab.parentElement.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();

        const offsetX = tabRect.left - parentRect.left;

        tabIndicator.style.transform = `translateX(${offsetX}px)`;
        tabIndicator.style.width = `${tabRect.width}px`;
    }

    // init position
    moveTabIndicator(activeTab);

    tabs.forEach(tab => {

        tab.addEventListener("mouseenter", () => {
            moveTabIndicator(tab);
        });

        tab.addEventListener("mouseleave", () => {
            moveTabIndicator(activeTab);
        });

        tab.addEventListener("click", () => {

            activeTab.classList.remove("active");
            tab.classList.add("active");

            activeTab = tab;

            moveTabIndicator(activeTab);
        });

    });

    // optional: responsive fix
    window.addEventListener("resize", () => {
        moveTabIndicator(activeTab);
    });
}

// =============================
// SCROLL ANIMATIE FOTOS
// =============================

const slides = document.querySelectorAll(".slide");

function animateSlides() {

    slides.forEach(slide => {

        const rect = slide.getBoundingClientRect();
        const img = slide.querySelector("img");
        const content = slide.querySelector(".slide-content");

        // Fade tekst in
        if (rect.top < window.innerHeight * 0.5 &&
            rect.bottom > window.innerHeight * 0.5) {

            slide.classList.add("active");

        } else {

            slide.classList.remove("active");

        }

        // Zoom afbeelding tijdens scroll
        const progress = Math.max(
            0,
            Math.min(1, -rect.top / window.innerHeight)
        );

        const scale = 1 + progress * 0.2;

        img.style.transform = `scale(${scale})`;
    });
}

window.addEventListener("scroll", animateSlides);
animateSlides();

// =============================
// CARDS ANIMATIE HOVER
// =============================

const cards = document.querySelectorAll(".oevertje-cards article");

// 👉 zet standaard middelste card active
cards.forEach(c => c.classList.remove("active"));
if (cards[1]) {
    cards[1].classList.add("active");
}

// klik gedrag
cards.forEach(card => {
    card.addEventListener("click", () => {
        cards.forEach(c => c.classList.remove("active"));
        card.classList.add("active");
    });
});