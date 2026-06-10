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

// Navigation indicator

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
// DONATIE TABS
// =============================

const tabs = document.querySelectorAll(".donatie-tabs p");
const tabIndicator = document.querySelector(".tab-indicator");

if (tabs.length && tabIndicator) {

    let activeTab = document.querySelector(".donatie-tabs p.active");

    function moveTabIndicator(tab) {
        tabIndicator.style.left = `${tab.offsetLeft}px`;
        tabIndicator.style.width = `${tab.offsetWidth}px`;
    }

    moveTabIndicator(activeTab);

    tabs.forEach(tab => {

        tab.addEventListener("mouseenter", () => {

            if (activeTab && tab !== activeTab) {
                activeTab.classList.add("temp-inactive");
            }

            moveTabIndicator(tab);
        });

        tab.addEventListener("mouseleave", () => {

            if (activeTab) {
                activeTab.classList.remove("temp-inactive");
            }

            moveTabIndicator(activeTab);
        });

        tab.addEventListener("click", () => {

            activeTab.classList.remove("active");

            tab.classList.add("active");

            activeTab = tab;

            moveTabIndicator(activeTab);
        });

    });
}