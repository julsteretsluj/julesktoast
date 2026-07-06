const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");
const copyTriggers = document.querySelectorAll("[data-copy-text]");

const toastStack = (() => {
  let node = document.querySelector(".toast-stack");
  if (!node) {
    node = document.createElement("div");
    node.className = "toast-stack";
    document.body.appendChild(node);
  }
  return node;
})();

const showToast = (message) => {
  const toast = document.createElement("div");
  toast.className = "toast-bite";
  toast.textContent = message;
  toastStack.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-6px)";
    window.setTimeout(() => toast.remove(), 180);
  }, 2600);
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggleButtons.forEach((button) => {
    button.textContent = theme === "dark" ? "Dark Roast" : "Light Roast";
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "Switch to Light Roast" : "Switch to Dark Roast"
    );
  });
};

const savedTheme = localStorage.getItem("jules-theme");
applyTheme(savedTheme === "dark" ? "dark" : "light");

themeToggleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const nextTheme =
      document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("jules-theme", nextTheme);
  });
});

copyTriggers.forEach((trigger) => {
  trigger.addEventListener("click", async (event) => {
    event.preventDefault();
    const text = trigger.getAttribute("data-copy-text");
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      showToast("✨ Email copied to clipboard! Freshly baked.");
    } catch {
      showToast("Could not copy email. Please copy manually.");
    }
  });
});

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
    { threshold: 0.05 }
  );

  revealTargets.forEach((item) => observer.observe(item));
}

const yearNode = document.getElementById("year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}

const LEGO_SET_CATALOG = {
  "10298": { name: "Vespa 125", theme: "LEGO Icons", year: 2022 },
  "10300": { name: "Back to the Future Time Machine", theme: "LEGO Icons", year: 2022 },
  "10309": { name: "Succulents", theme: "Botanicals", year: 2022 },
  "10329": { name: "Tiny Plants", theme: "Botanicals", year: 2023 },
  "10345": { name: "Mixed Flowerpot", theme: "Botanicals", year: 2025 },
  "10349": { name: "Happy Plants", theme: "Botanicals", year: 2025 },
  "11506": { name: "Rocking Plants", theme: "Botanicals", year: 2026 },
  "11508": { name: "Daisies", theme: "Botanicals", year: 2026 },
  "21333": { name: "The Starry Night", theme: "LEGO Ideas", year: 2022 },
  "21342": { name: "The Insect Collection", theme: "LEGO Ideas", year: 2023 },
  "21345": { name: "Polaroid OneStep SX-70", theme: "LEGO Ideas", year: 2024 },
  "21357": { name: "Disney Pixar Luxo Jr.", theme: "LEGO Ideas", year: 2025 },
  "21358": { name: "Minifigure Vending Machine", theme: "LEGO Ideas", year: 2025 },
  "21362": { name: "Mineral Collection", theme: "LEGO Ideas", year: 2025 },
  "21366": { name: "Floating Sea Otters", theme: "LEGO Ideas", year: 2026 },
  "31147": { name: "Retro Camera", theme: "Creator 3-in-1", year: 2024 },
  "31163": { name: "Playful Cat", theme: "Creator 3-in-1", year: 2025 },
  "31173": { name: "Wild Animals: Tropical Toucan", theme: "Creator 3-in-1", year: 2025 },
  "31208": { name: "Hokusai - The Great Wave", theme: "LEGO Art", year: 2023 },
  "31214": { name: "LOVE", theme: "LEGO Art", year: 2025 },
  "31216": { name: "Keith Haring - Dancing Figures", theme: "LEGO Art", year: 2025 },
  "40516": { name: "Everyone Is Awesome", theme: "LEGO Icons", year: 2021 },
  "40569": { name: "London Postcard", theme: "Postcards", year: 2022 },
  "40713": { name: "Japan Postcard", theme: "Postcards", year: 2024 },
  "40791": { name: "The Goblet of Fire Figures", theme: "BrickHeadz", year: 2025 },
  "40801": { name: "Mike, Dustin, Lucas and Will Figures", theme: "BrickHeadz", year: 2025 },
  "40813": { name: "Lucky Cat", theme: "Chinese Traditional Festivals", year: 2024 },
  "40816": { name: "Decorative Easter Egg", theme: "Seasonal - Easter", year: 2025 },
  "40820": { name: "Up-Scaled Santa Minifigure", theme: "Seasonal - Christmas", year: 2025 },
  "40860": { name: "Toy Story", theme: "BrickHeadz", year: 2026 },
  "40861": { name: "Sulley, Mike and Boo Figures", theme: "BrickHeadz", year: 2026 },
  "40879": {
    name: "Eleven, Max, Demogorgon and Holly Figures",
    theme: "BrickHeadz",
    year: 2026,
  },
  "40902": { name: "Tribute to Leonardo da Vinci", theme: "LEGO Art", year: 2026 },
  "40916": { name: "Floral Picture Frame", theme: "Botanicals", year: 2026 },
  "40923": { name: "Shrek, Donkey & Gingy Figures", theme: "BrickHeadz", year: 2026 },
  "40926": { name: "SEGA Genesis Console", theme: "LEGO Icons", year: 2026 },
  "40954": { name: "Germany Postcard", theme: "Postcards", year: 2026 },
  "43217": { name: "Up House", theme: "Disney", year: 2023 },
  "43230": { name: "Walt Disney Tribute Camera", theme: "Disney", year: 2023 },
  "43264": { name: "Toy Story Celebration Train & RC Car", theme: "Disney", year: 2025 },
  "43279": { name: "WALL-E and EVE", theme: "Disney", year: 2025 },
  "71426": { name: "Piranha Plant", theme: "Super Mario", year: 2023 },
  "72037": { name: "Mario Kart - Mario & Standard Kart", theme: "Super Mario", year: 2025 },
  "72046": { name: "Game Boy", theme: "Super Mario", year: 2025 },
  "76449": { name: "Chomping Monster Book of Monsters", theme: "Harry Potter", year: 2025 },
  "76462": { name: "Hogwarts House Crest", theme: "Harry Potter", year: 2026 },
  "76469": { name: "Dobby the Free Elf", theme: "Harry Potter", year: 2026 },
  "77255": { name: "Lightning McQueen", theme: "Speed Champions", year: 2026 },
  "853666": { name: "Shark Suit Guy Key Chain", theme: "Gear", year: 2017 },
};

const normalizeLegoThemeTag = (tag) => {
  const raw = (tag || "").trim();
  if (!raw) return "LEGO Collection";
  if (/^icons$/i.test(raw) || /^lego icons$/i.test(raw)) {
    return "LEGO Icons";
  }
  return raw;
};

const addLegoSetShopLinks = () => {
  const cards = document.querySelectorAll(".lego-owned-set");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.querySelectorAll(".lego-set-shop-row").forEach((node) => node.remove());
    card.querySelectorAll(".lego-set-series-tag").forEach((node) => node.remove());

    const img = card.querySelector("img");
    let label = card.querySelector("p");
    if (!label) {
      label = document.createElement("p");
      if (img && img.parentElement === card) {
        img.insertAdjacentElement("afterend", label);
      } else {
        card.appendChild(label);
      }
    }
    const explicitSetName = card.getAttribute("data-set-name")?.trim() || "";
    const explicitSetTheme = card.getAttribute("data-set-theme")?.trim() || "";
    const explicitSetNumber = card.getAttribute("data-set-number")?.trim() || "";
    const explicitSetYear = Number(card.getAttribute("data-set-year") || 0);
    const sourceText = `${img?.getAttribute("alt") || ""} ${label?.textContent || ""}`;
    const setNumberMatch = sourceText.match(/(\d{4,6})/);
    const setNumber = explicitSetNumber || setNumberMatch?.[1] || "";
    const metadata = LEGO_SET_CATALOG[setNumber] || {};
    const releaseYear = explicitSetYear || metadata.year || 0;
    const setName = explicitSetName || metadata.name || (setNumber ? `LEGO Set ${setNumber}` : "LEGO Collection");
    const setTheme = normalizeLegoThemeTag(explicitSetTheme || metadata.theme || "LEGO Collection");
    const isRetired = releaseYear > 0 && releaseYear <= 2023;

    if (label) {
      label.textContent = setName;
      label.classList.add("lego-owned-set-name");
    }

    const seriesTag = document.createElement("span");
    seriesTag.className = "lego-set-series-tag";
    seriesTag.textContent = setTheme;
    card.appendChild(seriesTag);

    if (!setNumber) return;

    const row = document.createElement("div");
    row.className = "lego-set-shop-row";

    const setNumberNode = document.createElement("span");
    setNumberNode.className = "lego-set-number";
    setNumberNode.textContent = `Set ${setNumber}`;
    row.appendChild(setNumberNode);

    if (isRetired) {
      const retiredNode = document.createElement("span");
      retiredNode.className = "lego-set-retired";
      retiredNode.textContent = "Retired";
      row.appendChild(retiredNode);
    } else {
      const sellerLink = document.createElement("a");
      sellerLink.className = "lego-set-seller-link";
      sellerLink.href = `https://www.lego.com/en-us/search?q=${setNumber}`;
      sellerLink.target = "_blank";
      sellerLink.rel = "noreferrer";
      sellerLink.textContent = "Seller";
      row.appendChild(sellerLink);
    }

    card.appendChild(row);
  });
};

const organizeLegoSetsByTag = () => {
  const container = document.querySelector(".lego-owned-grid");
  if (!container) return;

  const cards = Array.from(container.querySelectorAll(".lego-owned-set"));
  if (!cards.length) return;

  const collator = new Intl.Collator(undefined, { sensitivity: "base", numeric: true });
  const groups = new Map();

  cards.forEach((card) => {
    const tagText =
      card.querySelector(".lego-set-series-tag")?.textContent?.trim() ||
      card.getAttribute("data-set-theme")?.trim() ||
      "LEGO Collection";

    if (!groups.has(tagText)) {
      groups.set(tagText, []);
    }
    groups.get(tagText).push(card);
  });

  container.textContent = "";

  Array.from(groups.keys())
    .sort((a, b) => collator.compare(a, b))
    .forEach((tag) => {
      const section = document.createElement("section");
      section.className = "lego-tag-group";

      const heading = document.createElement("h4");
      heading.className = "lego-tag-heading";
      heading.textContent = tag;

      const grid = document.createElement("div");
      grid.className = "lego-theme-grid";

      const groupCards = groups.get(tag) || [];
      groupCards
        .sort((a, b) => {
          const nameA = a.querySelector(".lego-owned-set-name")?.textContent?.trim() || "";
          const nameB = b.querySelector(".lego-owned-set-name")?.textContent?.trim() || "";
          return collator.compare(nameA, nameB);
        })
        .forEach((card) => grid.appendChild(card));

      section.append(heading, grid);
      container.appendChild(section);
    });
};

addLegoSetShopLinks();
organizeLegoSetsByTag();

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
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/330px-Skyscrapers_of_Shinjuku_2009_January.jpg",
    },
    Canada: {
      basics: "Region: North America | Languages: English, French | Currency: CAD",
      unStats: "UN stats: Founding member (1945) | Population ~40M | Area 9,984,670 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Parliament-Ottawa.jpg/330px-Parliament-Ottawa.jpg",
    },
    "New Zealand": {
      basics: "Region: Oceania | Languages: English, Maori | Currency: NZD",
      unStats: "UN stats: Founding member (1945) | Population ~5.3M | Area 268,838 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Wellington_Harbour%2C_New_Zealand%2C_Nov._2009.jpg/330px-Wellington_Harbour%2C_New_Zealand%2C_Nov._2009.jpg",
    },
    Vietnam: {
      basics: "Region: Southeast Asia | Language: Vietnamese | Currency: VND",
      unStats: "UN stats: Member since 1977 | Population ~100M | Area 331,212 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Hanoi_skyline_with_Ba_Vi_Mountain.jpg/330px-Hanoi_skyline_with_Ba_Vi_Mountain.jpg",
    },
    Netherlands: {
      basics: "Region: Europe | Language: Dutch | Currency: EUR",
      unStats: "UN stats: Founding member (1945) | Population ~18M | Area 41,850 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png/330px-Imagen_de_los_canales_conc%C3%A9ntricos_en_%C3%81msterdam.png",
    },
    Thailand: {
      basics: "Region: Southeast Asia | Language: Thai | Currency: THB",
      unStats: "UN stats: Member since 1946 | Population ~72M | Area 513,120 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg/330px-4Y1A1159_Bangkok_%2833536795515%29.jpg",
    },
    Cambodia: {
      basics: "Region: Southeast Asia | Language: Khmer | Currency: KHR",
      unStats: "UN stats: Member since 1955 | Population ~17M | Area 181,035 km²",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Phnom_Penh_skyline_from_TK_district_Dec_2024.jpg/330px-Phnom_Penh_skyline_from_TK_district_Dec_2024.jpg",
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
