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