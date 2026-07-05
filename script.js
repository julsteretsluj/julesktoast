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

  const centerNode = (node) => {
    const left = node.offsetLeft - (educationTimeline.clientWidth - node.clientWidth) / 2;
    educationTimeline.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  };

  const setActiveNode = (node) => {
    timelineNodes.forEach((item) => item.classList.remove("is-active"));
    node.classList.add("is-active");
    centerNode(node);
  };

  timelineNodes.forEach((node, index) => {
    if (index === 0) {
      node.classList.add("is-active");
    }
    node.addEventListener("mouseenter", () => setActiveNode(node));
    node.addEventListener("focus", () => setActiveNode(node));
    node.addEventListener("click", () => setActiveNode(node));
  });

  const activeNode = educationTimeline.querySelector(".timeline-node.is-active");
  if (activeNode) {
    centerNode(activeNode);
  }
}

const journeyMap = document.querySelector(".journey-map-wrap");
const journeyPlayButton = document.getElementById("journey-play");
const journeyDot = document.getElementById("journey-dot");

if (journeyMap && journeyPlayButton && journeyDot) {
  const journeyStops = Array.from(journeyMap.querySelectorAll(".journey-point"));
  const segmentDurationMs = 1200;

  let stopCenters = [];
  let segmentIndex = 0;
  let segmentProgress = 0;
  let playing = false;
  let rafId = null;
  let lastTime = null;

  const getStopCenter = (stop) => {
    const pin = stop.querySelector(".point-index") || stop;
    const pinRect = pin.getBoundingClientRect();
    const mapRect = journeyMap.getBoundingClientRect();
    return {
      x: pinRect.left + pinRect.width / 2 - mapRect.left,
      y: pinRect.top + pinRect.height / 2 - mapRect.top,
    };
  };

  const refreshStopCenters = () => {
    stopCenters = journeyStops.map(getStopCenter);
  };

  const getCurrentPosition = () => {
    const start = stopCenters[segmentIndex];
    const end = stopCenters[Math.min(segmentIndex + 1, stopCenters.length - 1)];
    if (!start || !end) return null;
    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress,
    };
  };

  const setDotPosition = (position) => {
    if (!position) return;
    journeyDot.style.left = `${position.x}px`;
    journeyDot.style.top = `${position.y}px`;
  };

  const updateButtonLabel = () => {
    journeyPlayButton.textContent = playing ? "⏸ Pause Route" : "▶ Play Route";
  };

  const stopAnimation = () => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    playing = false;
    lastTime = null;
    updateButtonLabel();
  };

  const animate = (time) => {
    if (!playing) return;
    if (lastTime == null) {
      lastTime = time;
      rafId = requestAnimationFrame(animate);
      return;
    }

    const delta = time - lastTime;
    lastTime = time;
    segmentProgress += delta / segmentDurationMs;

    while (segmentProgress >= 1) {
      segmentProgress -= 1;
      segmentIndex += 1;
      if (segmentIndex >= stopCenters.length - 1) {
        segmentIndex = stopCenters.length - 1;
        segmentProgress = 0;
        setDotPosition(stopCenters[segmentIndex]);
        stopAnimation();
        return;
      }
    }

    setDotPosition(getCurrentPosition());
    rafId = requestAnimationFrame(animate);
  };

  journeyPlayButton.addEventListener("click", () => {
    if (playing) {
      stopAnimation();
      return;
    }

    refreshStopCenters();
    if (segmentIndex >= stopCenters.length - 1) {
      segmentIndex = 0;
      segmentProgress = 0;
      setDotPosition(stopCenters[0]);
    }

    playing = true;
    updateButtonLabel();
    rafId = requestAnimationFrame(animate);
  });

  window.addEventListener("resize", () => {
    refreshStopCenters();
    if (!playing) {
      if (segmentIndex >= stopCenters.length) {
        segmentIndex = Math.max(0, stopCenters.length - 1);
      }
      if (segmentIndex === stopCenters.length - 1) {
        setDotPosition(stopCenters[segmentIndex]);
      } else {
        setDotPosition(getCurrentPosition());
      }
    }
  });

  refreshStopCenters();
  setDotPosition(stopCenters[0]);
  updateButtonLabel();
}
