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
const journeyMapScene = document.getElementById("journey-map-scene");
const journeyPlayButton = document.getElementById("journey-play");
const journeyZoomInButton = document.getElementById("journey-zoom-in");
const journeyZoomOutButton = document.getElementById("journey-zoom-out");
const journeyZoomResetButton = document.getElementById("journey-zoom-reset");
const journeyDot = document.getElementById("journey-dot");
const journeyRouteLine = document.getElementById("journey-route-line");

if (journeyMap && journeyMapScene && journeyPlayButton && journeyDot) {
  const journeyStops = Array.from(journeyMap.querySelectorAll(".journey-point")).sort((a, b) => {
    return Number(a.getAttribute("data-stop")) - Number(b.getAttribute("data-stop"));
  });
  const segmentDurationMs = 1200;
  const sceneWidth = 1000;
  const sceneHeight = 460;

  let stopCentersPercent = [];
  let segmentIndex = 0;
  let segmentProgress = 0;
  let playing = false;
  let rafId = null;
  let lastTime = null;
  let zoomLevel = 1;

  const getStopPercentCenter = (stop) => {
    const xRaw = (stop.style.getPropertyValue("--x") || "0%").trim().replace("%", "");
    const yRaw = (stop.style.getPropertyValue("--y") || "0%").trim().replace("%", "");
    const x = Number(xRaw) / 100;
    const y = Number(yRaw) / 100;
    return {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    };
  };

  const toScenePixels = (pointPercent) => {
    return {
      x: pointPercent.x * sceneWidth,
      y: pointPercent.y * sceneHeight,
    };
  };

  const refreshStopCenters = () => {
    stopCentersPercent = journeyStops.map(getStopPercentCenter);
    if (journeyRouteLine) {
      const points = stopCentersPercent.map((percentPoint) => {
        const px = toScenePixels(percentPoint);
        return `${px.x.toFixed(1)},${px.y.toFixed(1)}`;
      });
      journeyRouteLine.setAttribute("points", points.join(" "));
    }
  };

  const getCurrentPosition = () => {
    const start = stopCentersPercent[segmentIndex];
    const end = stopCentersPercent[Math.min(segmentIndex + 1, stopCentersPercent.length - 1)];
    if (!start || !end) return null;
    const percentPosition = {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress,
    };
    return toScenePixels(percentPosition);
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
      if (segmentIndex >= stopCentersPercent.length - 1) {
        segmentIndex = stopCentersPercent.length - 1;
        segmentProgress = 0;
        setDotPosition(toScenePixels(stopCentersPercent[segmentIndex]));
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
    if (segmentIndex >= stopCentersPercent.length - 1) {
      segmentIndex = 0;
      segmentProgress = 0;
      setDotPosition(toScenePixels(stopCentersPercent[0]));
    }

    playing = true;
    updateButtonLabel();
    rafId = requestAnimationFrame(animate);
  });

  window.addEventListener("resize", () => {
    refreshStopCenters();
    if (!playing) {
      if (segmentIndex >= stopCentersPercent.length) {
        segmentIndex = Math.max(0, stopCentersPercent.length - 1);
      }
      if (segmentIndex === stopCentersPercent.length - 1) {
        setDotPosition(toScenePixels(stopCentersPercent[segmentIndex]));
      } else {
        setDotPosition(getCurrentPosition());
      }
    }
  });

  const updateZoom = () => {
    journeyMapScene.style.transform = `scale(${zoomLevel})`;
  };

  if (journeyZoomInButton && journeyZoomOutButton && journeyZoomResetButton) {
    journeyZoomInButton.addEventListener("click", () => {
      zoomLevel = Math.min(2.4, zoomLevel + 0.2);
      updateZoom();
    });
    journeyZoomOutButton.addEventListener("click", () => {
      zoomLevel = Math.max(1, zoomLevel - 0.2);
      updateZoom();
    });
    journeyZoomResetButton.addEventListener("click", () => {
      zoomLevel = 1;
      updateZoom();
    });
  }

  journeyMap.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = Math.sign(event.deltaY);
    zoomLevel = Math.max(1, Math.min(2.4, zoomLevel - delta * 0.12));
    updateZoom();
  });

  refreshStopCenters();
  setDotPosition(toScenePixels(stopCentersPercent[0]));
  updateZoom();
  updateButtonLabel();
}
