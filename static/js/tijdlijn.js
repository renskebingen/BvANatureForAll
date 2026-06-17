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

// =============================
// KLEUREN PER TAB
// =============================

const tabThemes = {
    0: { // Jaarlijks - blauw naar lichtblauw
        cardTop: "linear-gradient(to bottom, #3554D6 0%, #1A90D9 100%)",
        btnGradient: "linear-gradient(to right, #2128B8 0%, #3554D6 100%)",
        btnShadow: "inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -3px 8px rgba(0,0,0,0.3), 0 8px 20px rgba(33, 40, 184, 0.4)"
    },
    1: { // Maandelijks - blauw (origineel)
        cardTop: "linear-gradient(to bottom, #2128B8 0%, #3347e6 100%)",
        btnGradient: "linear-gradient(to right, #2128B8 0%, #3554D6 100%)",
        btnShadow: "inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -3px 8px rgba(0,0,0,0.3), 0 8px 20px rgba(33, 40, 184, 0.4)"
    },
    2: { // Eenmalig - blauw naar ijsblauw
        cardTop: "linear-gradient(to bottom, #3554D6 0%, #BFE5FD 100%)",
        btnGradient: "linear-gradient(to right, #2128B8 0%, #3554D6 100%)",
        btnShadow: "inset 0 2px 6px rgba(255,255,255,0.25), inset 0 -3px 8px rgba(0,0,0,0.3), 0 8px 20px rgba(33, 40, 184, 0.4)"
    }
};

// =============================
// KAARTEN DATA PER TAB
// =============================

const cardsData = {
    0: [ // Jaarlijks
        {
            featured: false,
            title: "Weide beschermer",
            img: "/images/laagstebedrag.png",
            items: [
                "Zorg voor 20 vierkante meter aan biodiversiteit",
                "Ontvang digitaal jou eigen persoonlijke certificaat",
                "Kom bovenaan te staan op onze donateurs pagina",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "PER JAAR:",
            prijs: "€50,-"
        },
        {
            featured: true,
            title: "Veldwachter",
            img: "/images/middenbedrag.png",
            items: [
                "Zorg voor 10 vierkante meter aan biodiversiteit",
                "Ontvang digitaal jou eigen persoonlijke certificaat",
                "Kom tussen onze mede donateurs te staan op onze site",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "PER JAAR:",
            prijs: "€100,-"
        },
        {
            featured: false,
            title: "Supporter",
            img: "/images/eigenbedrag.png",
            items: [
                "Ontvang een digitale supporter badge",
                "Vanaf €50 ontvang je een persoonlijke bedankmail van ons team",
                "Kom tussen onze mede donateurs te staan op onze site",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "PER JAAR:",
            prijs: "€-,-"
        }
    ],
    1: [ // Maandelijks
        {
            featured: false,
            title: "Weide beschermer",
            img: "/images/laagstebedrag.png",
            items: [
                "Zorg voor 5 vierkante meter aan biodiversiteit",
                "Ontvang digitaal jou eigen persoonlijke certificaat",
                "Kom bovenaan te staan op onze donateurs pagina",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "PER MAAND:",
            prijs: "€10,-"
        },
        {
            featured: true,
            title: "Veldwachter",
            img: "/images/middenbedrag.png",
            items: [
                "Zorg voor 2 vierkante meter aan biodiversiteit",
                "Ontvang digitaal jou eigen persoonlijke certificaat",
                "Kom tussen onze mede donateurs te staan op onze site",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "PER MAAND:",
            prijs: "€5,-"
        },
        {
            featured: false,
            title: "Supporter",
            img: "/images/eigenbedrag.png",
            items: [
                "Ontvang een digitale supporter badge",
                "Vanaf €250 ontvang je een persoonlijke bedankmail van ons team",
                "Kom tussen onze mede donateurs te staan op onze site",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "PER MAAND:",
            prijs: "€-,-"
        }
    ],
    2: [ // Eenmalig
        {
            featured: false,
            title: "Weide beschermer",
            img: "/images/laagstebedrag.png",
            items: [
                "Zorg voor 5 vierkante meter aan biodiversiteit",
                "Ontvang digitaal jou eigen persoonlijke certificaat",
                "Kom bovenaan te staan op onze donateurs pagina",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "EENMALIG:",
            prijs: "€50,-"
        },
        {
            featured: true,
            title: "Veldwachter",
            img: "/images/middenbedrag.png",
            items: [
                "Zorg voor 2 vierkante meter aan biodiversiteit",
                "Ontvang digitaal jou eigen persoonlijke certificaat",
                "Kom tussen onze mede donateurs te staan op onze site",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "EENMALIG:",
            prijs: "€15,-"
        },
        {
            featured: false,
            title: "Supporter",
            img: "/images/eigenbedrag.png",
            items: [
                "Ontvang een digitale supporter badge",
                "Vanaf €100 ontvang je een persoonlijke bedankmail van ons team",
                "Kom tussen onze mede donateurs te staan op onze site",
                "Ontvang digitaal een update over jouw donatie die te delen is met vrienden"
            ],
            prijsLabel: "EENMALIG:",
            prijs: "€-,-"
        }
    ]
};

function buildCards(tabIndex) {
    const container = document.querySelector(".oevertje-cards");
    const theme = tabThemes[tabIndex];

    container.innerHTML = "";

    cardsData[tabIndex].forEach((data, i) => {
        const article = document.createElement("article");
        if (data.featured) article.classList.add("featured-card");

        article.innerHTML = `
            ${data.featured ? `
                <div class="meest-gekozen">
                    <img src="/images/meestgekozen.svg" alt="Meest gekozen">
                </div>` : ""}
            <div class="card-top" style="background: ${theme.cardTop};">
                <h3>${data.title}</h3>
                <img src="${data.img}" alt="Oevertje" class="oevertje-image">
            </div>
            <div class="card-content">
                <ul>
                    ${data.items.map(item => `<li>${item}</li>`).join("")}
                </ul>
                <div class="prijs">
                    <p>${data.prijsLabel}</p>
                    <span>${data.prijs}</span>
                </div>
                <button class="kopen-btn" style="background: ${theme.btnGradient}; box-shadow: ${theme.btnShadow};">
                    Oevertje kopen
                </button>
            </div>
            <img src="/images/footer.png" alt="footer" class="card-footer">
        `;

        container.appendChild(article);
    });

    // herstel active state op middelste kaart
    const cards = document.querySelectorAll(".oevertje-cards article");
    cards.forEach(c => c.classList.remove("active"));
    if (cards[1]) cards[1].classList.add("active");

    // klik gedrag opnieuw koppelen
    cards.forEach(card => {
        card.addEventListener("click", () => {
            cards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        });
    });
}

// =============================
// TAB LOGICA
// =============================

if (tabs.length && tabIndicator) {

    let activeTab = document.querySelector(".donatie-tabs p.active");
    let activeTabIndex = 1; // standaard maandelijks

    if (!activeTab) {
        activeTab = tabs[0];
        activeTab.classList.add("active");
        activeTabIndex = 0;
    } else {
        tabs.forEach((t, i) => { if (t === activeTab) activeTabIndex = i; });
    }

    function moveTabIndicator(tab) {
        const parentRect = tab.parentElement.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        const offsetX = tabRect.left - parentRect.left;
        tabIndicator.style.transform = `translateX(${offsetX}px)`;
        tabIndicator.style.width = `${tabRect.width}px`;
    }

    moveTabIndicator(activeTab);
    buildCards(activeTabIndex);

    tabs.forEach((tab, index) => {

        tab.addEventListener("mouseenter", () => moveTabIndicator(tab));
        tab.addEventListener("mouseleave", () => moveTabIndicator(activeTab));

        tab.addEventListener("click", () => {
            activeTab.classList.remove("active");
            tab.classList.add("active");
            activeTab = tab;
            activeTabIndex = index;
            moveTabIndicator(activeTab);
            buildCards(activeTabIndex);
        });

    });

    window.addEventListener("resize", () => moveTabIndicator(activeTab));
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

// =============================
// LEES MEER BUTTON
// =============================

document.querySelector('.leesmeerbtn').addEventListener('click', () => {
    document.querySelector('.waarom').scrollIntoView({ behavior: 'smooth' });
});