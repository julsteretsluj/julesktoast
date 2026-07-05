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
const journeyCountryPopup = document.getElementById("journey-country-popup");
const journeyCountryImage = document.getElementById("journey-country-image");
const journeyCountryName = document.getElementById("journey-country-name");
const journeyCountryCapital = document.getElementById("journey-country-capital");
const journeyCountryBasics = document.getElementById("journey-country-basics");
const journeyCountryUnStats = document.getElementById("journey-country-un-stats");

if (journeyMap && journeyMapScene && journeyPlayButton && journeyDot) {
  const journeyStops = Array.from(journeyMap.querySelectorAll(".journey-point")).sort((a, b) => {
    return Number(a.getAttribute("data-stop")) - Number(b.getAttribute("data-stop"));
  });
  const segmentDurationMs = 1200;
  const sceneWidth = 950;
  const sceneHeight = 620;
  const planeHeadingOffsetDeg = 18;

  let stopCentersPercent = [];
  let segmentIndex = 0;
  let segmentProgress = 0;
  let playing = false;
  let rafId = null;
  let lastTime = null;
  let zoomLevel = 1;
  let activePopupStop = null;

  const countryFacts = {
    Japan: {
      basics: "Region: East Asia | Language: Japanese | Currency: JPY",
      unStats: "UN stats: Member since 1956 | Population ~124M | Area 377,975 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Tokyo_Skyline_at_night_-_Dec_2022.jpg/640px-Tokyo_Skyline_at_night_-_Dec_2022.jpg",
    },
    Canada: {
      basics: "Region: North America | Languages: English, French | Currency: CAD",
      unStats: "UN stats: Founding member (1945) | Population ~40M | Area 9,984,670 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Parliament-Ottawa.jpg/640px-Parliament-Ottawa.jpg",
    },
    "New Zealand": {
      basics: "Region: Oceania | Languages: English, Maori | Currency: NZD",
      unStats: "UN stats: Founding member (1945) | Population ~5.3M | Area 268,838 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Wellington_City.jpg/640px-Wellington_City.jpg",
    },
    Vietnam: {
      basics: "Region: Southeast Asia | Language: Vietnamese | Currency: VND",
      unStats: "UN stats: Member since 1977 | Population ~100M | Area 331,212 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Hanoi_skyline.jpg/640px-Hanoi_skyline.jpg",
    },
    Netherlands: {
      basics: "Region: Europe | Language: Dutch | Currency: EUR",
      unStats: "UN stats: Founding member (1945) | Population ~18M | Area 41,850 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/KeizersgrachtReguliersgrachtAmsterdam.jpg/640px-KeizersgrachtReguliersgrachtAmsterdam.jpg",
    },
    Thailand: {
      basics: "Region: Southeast Asia | Language: Thai | Currency: THB",
      unStats: "UN stats: Member since 1946 | Population ~72M | Area 513,120 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Bangkok_skytrain_sunset.jpg/640px-Bangkok_skytrain_sunset.jpg",
    },
    Cambodia: {
      basics: "Region: Southeast Asia | Language: Khmer | Currency: KHR",
      unStats: "UN stats: Member since 1955 | Population ~17M | Area 181,035 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Phnom_Penh_skyline.jpg/640px-Phnom_Penh_skyline.jpg",
    },
  };

  const getStopPercentCenter = (stop) => {
    const lat = Number(stop.getAttribute("data-lat"));
    const lon = Number(stop.getAttribute("data-lon"));
    const mapX = Number(stop.getAttribute("data-x"));
    const mapY = Number(stop.getAttribute("data-y"));
    const x = Number.isFinite(mapX) ? mapX / 100 : (lon + 180) / 360;
    const y = Number.isFinite(mapY) ? mapY / 100 : (90 - lat) / 180;

    stop.style.setProperty("--x", `${(x * 100).toFixed(4)}%`);
    stop.style.setProperty("--y", `${(y * 100).toFixed(4)}%`);

    return {
      x: Number.isFinite(x) ? x : 0,
      y: Number.isFinite(y) ? y : 0,
    };
  };

  const toRoutePixels = (pointPercent) => {
    return {
      x: pointPercent.x * sceneWidth,
      y: pointPercent.y * sceneHeight,
    };
  };

  const refreshStopCenters = () => {
    stopCentersPercent = journeyStops.map(getStopPercentCenter);
    if (journeyRouteLine) {
      const points = stopCentersPercent.map((percentPoint) => {
        const px = toRoutePixels(percentPoint);
        return `${px.x.toFixed(1)},${px.y.toFixed(1)}`;
      });
      journeyRouteLine.setAttribute("points", points.join(" "));
    }
  };

  const getCurrentPosition = () => {
    const start = stopCentersPercent[segmentIndex];
    const end = stopCentersPercent[Math.min(segmentIndex + 1, stopCentersPercent.length - 1)];
    if (!start || !end) return null;
    return {
      x: start.x + (end.x - start.x) * segmentProgress,
      y: start.y + (end.y - start.y) * segmentProgress,
    };
  };

  const setDotPosition = (position) => {
    if (!position) return;
    journeyDot.style.left = `${(position.x * 100).toFixed(4)}%`;
    journeyDot.style.top = `${(position.y * 100).toFixed(4)}%`;
  };

  const getSegmentHeadingDeg = (start, end) => {
    if (!start || !end) return planeHeadingOffsetDeg;
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    if (Math.abs(deltaX) < 0.00001 && Math.abs(deltaY) < 0.00001) {
      return planeHeadingOffsetDeg;
    }
    return (Math.atan2(deltaY, deltaX) * 180) / Math.PI + planeHeadingOffsetDeg;
  };

  const setDotHeading = (degrees) => {
    journeyDot.style.setProperty("--plane-rotation", `${degrees.toFixed(2)}deg`);
  };

  const hideCountryPopup = () => {
    if (!journeyCountryPopup) return;
    journeyCountryPopup.classList.remove("is-visible");
    journeyCountryPopup.setAttribute("aria-hidden", "true");
    activePopupStop = null;
  };

  const showCountryPopup = (stop) => {
    if (
      !journeyCountryPopup ||
      !journeyCountryImage ||
      !journeyCountryName ||
      !journeyCountryCapital ||
      !journeyCountryBasics ||
      !journeyCountryUnStats
    ) {
      return;
    }

    const country = stop.getAttribute("data-country") || "Country";
    const capital = stop.getAttribute("data-capital") || "Capital";
    const details = countryFacts[country] || {
      basics: "Region: Global | Language: Multiple | Currency: Local",
      unStats: "UN stats: Member state | Population data varies | Area data varies",
      image: "",
    };

    journeyCountryName.textContent = country;
    journeyCountryCapital.textContent = `Capital: ${capital}`;
    journeyCountryBasics.textContent = details.basics;
    journeyCountryUnStats.textContent = details.unStats;
    journeyCountryImage.src = details.image;
    journeyCountryImage.alt = `${capital} city photo`;

    const point = getStopPercentCenter(stop);
    const anchor = toRoutePixels(point);

    journeyCountryPopup.classList.add("is-visible");
    journeyCountryPopup.setAttribute("aria-hidden", "false");

    const popupWidth = journeyCountryPopup.offsetWidth || 220;
    const popupHeight = journeyCountryPopup.offsetHeight || 170;
    const minPad = 8;

    let left = anchor.x + 14;
    let top = anchor.y - popupHeight - 14;
    if (left + popupWidth > sceneWidth - minPad) left = anchor.x - popupWidth - 14;
    if (left < minPad) left = minPad;
    if (top < minPad) top = anchor.y + 14;
    if (top + popupHeight > sceneHeight - minPad) top = sceneHeight - popupHeight - minPad;

    journeyCountryPopup.style.left = `${left}px`;
    journeyCountryPopup.style.top = `${top}px`;
    activePopupStop = stop;
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
        setDotPosition(stopCentersPercent[segmentIndex]);
        if (stopCentersPercent.length > 1) {
          setDotHeading(
            getSegmentHeadingDeg(
              stopCentersPercent[stopCentersPercent.length - 2],
              stopCentersPercent[stopCentersPercent.length - 1]
            )
          );
        }
        stopAnimation();
        return;
      }
    }

    setDotHeading(
      getSegmentHeadingDeg(
        stopCentersPercent[segmentIndex],
        stopCentersPercent[Math.min(segmentIndex + 1, stopCentersPercent.length - 1)]
      )
    );
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
      setDotPosition(stopCentersPercent[0]);
    }

    setDotHeading(
      getSegmentHeadingDeg(
        stopCentersPercent[segmentIndex],
        stopCentersPercent[Math.min(segmentIndex + 1, stopCentersPercent.length - 1)]
      )
    );
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
        setDotPosition(stopCentersPercent[segmentIndex]);
        if (stopCentersPercent.length > 1) {
          setDotHeading(
            getSegmentHeadingDeg(
              stopCentersPercent[stopCentersPercent.length - 2],
              stopCentersPercent[stopCentersPercent.length - 1]
            )
          );
        }
      } else {
        setDotPosition(getCurrentPosition());
        setDotHeading(
          getSegmentHeadingDeg(
            stopCentersPercent[segmentIndex],
            stopCentersPercent[Math.min(segmentIndex + 1, stopCentersPercent.length - 1)]
          )
        );
      }
    }
    if (activePopupStop) {
      showCountryPopup(activePopupStop);
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

  journeyStops.forEach((stop) => {
    stop.addEventListener("mouseenter", () => showCountryPopup(stop));
    stop.addEventListener("mouseleave", hideCountryPopup);
    stop.addEventListener("click", () => showCountryPopup(stop));
  });

  journeyMapScene.addEventListener("mouseleave", hideCountryPopup);

  refreshStopCenters();
  setDotPosition(stopCentersPercent[0]);
  if (stopCentersPercent.length > 1) {
    setDotHeading(getSegmentHeadingDeg(stopCentersPercent[0], stopCentersPercent[1]));
  }
  updateZoom();
  updateButtonLabel();
}
