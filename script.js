const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const revealTargets = document.querySelectorAll("[data-reveal], .reveal-target");

if (revealTargets.length > 0) {
  revealTargets.forEach((item) => item.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.18 }
  );

  revealTargets.forEach((item) => observer.observe(item));
}

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const educationTimeline = document.getElementById("education-timeline");
if (educationTimeline) {
  const timelineNodes = educationTimeline.querySelectorAll(".timeline-node");

  timelineNodes.forEach((node) => {
    const depth = Number(node.getAttribute("data-depth") || "18");
    node.style.transform = `translateZ(${depth}px)`;

    node.addEventListener("click", () => {
      timelineNodes.forEach((item) => item.classList.remove("is-active"));
      node.classList.add("is-active");
    });
  });

  educationTimeline.addEventListener("pointermove", (event) => {
    const box = educationTimeline.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    const rotateY = x * 10;
    const rotateX = y * -8;
    educationTimeline.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  educationTimeline.addEventListener("pointerleave", () => {
    educationTimeline.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}
