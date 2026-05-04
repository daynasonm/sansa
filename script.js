const featuredTemple = document.getElementById("featuredTemple");
const featureCount = document.getElementById("featureCount");
const featureTitle = document.getElementById("featureTitle");
const featureLocation = document.getElementById("featureLocation");
const featureDescription = document.getElementById("featureDescription");
const mapFeaturePanel = document.querySelector(".map-feature-panel");
const routeMap = document.querySelector(".route-map");
const routeItems = document.querySelectorAll(".route-dot[data-temple], .route-label[data-temple], .route-node[data-temple], .temple-map-item[data-temple]");
const revealItems = document.querySelectorAll("[data-reveal]");
const blueprintSection = document.querySelector(".blueprint-section");
const blueprintStage = document.querySelector(".blueprint-stage");
const blueprintSteps = document.querySelectorAll(".blueprint-step");
const blueprintCards = document.querySelectorAll(".blueprint-card");
const introSplash = document.getElementById("introSplash");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const temples = {
  Buseoksa: {
    count: "01 / 07",
    image: "assets/images/Buseoksa.svg",
    location: "Yeongju, Gyeongsangbuk-do",
    description:
      "A northern stop in the Sansa group, Buseoksa introduces the route as a mountain monastery where architecture, worship, and landscape are read together."
  },
  Magoksa: {
    count: "02 / 07",
    image: "assets/images/Magoksa.svg",
    location: "Gongju, Chungcheongnam-do",
    description:
      "Magoksa sits in the central-western portion of the route, a useful pause for travelers moving between the historic cities and mountain valleys of Korea."
  },
  Bongjeongsa: {
    count: "03 / 07",
    image: "assets/images/Bongjeongsa.svg",
    location: "Andong, Gyeongsangbuk-do",
    description:
      "Bongjeongsa is part of the Sansa story of long continuity: a working monastery where the visitor reads time through timber, thresholds, and courtyards."
  },
  Beopjusa: {
    count: "04 / 07",
    image: "assets/images/Beopjusa.svg",
    location: "Boeun, Chungcheongbuk-do",
    description:
      "Beopjusa brings the vertical silhouette of Korean Buddhist architecture, pairing monumental form with the quieter rhythm of mountain practice."
  },
  Seonamsa: {
    count: "05 / 07",
    image: "assets/images/Seonamsa.svg",
    location: "Suncheon, Jeollanam-do",
    description:
      "Seonamsa carries SANSA toward Korea's southern provinces, where temple paths, water, trees, and low buildings feel closely stitched together."
  },
  Tongdosa: {
    count: "06 / 07",
    image: "assets/images/Tongdosa.svg",
    location: "Yangsan, Gyeongsangnam-do",
    description:
      "Tongdosa is one of the seven UNESCO-listed monasteries and a strong anchor for travelers exploring the southeastern part of the SANSA route."
  },
  Daeheungsa: {
    count: "07 / 07",
    image: "assets/images/Daeheungsa.svg",
    location: "Haenam, Jeollanam-do",
    description:
      "Daeheungsa closes the route in the far south, inviting a slower trip where remoteness, mountain setting, and daily temple life matter as much as arrival."
  }
};

function setTemple(name) {
  const temple = temples[name];

  if (!temple) return;

  const updateFeature = () => {
    featuredTemple.src = temple.image;
    featuredTemple.alt = `${name} temple illustration`;
    featureCount.textContent = temple.count;
    mapFeaturePanel?.style.setProperty("--signal-progress", `${(Number.parseInt(temple.count, 10) / 7) * 100}%`);
    featureTitle.textContent = name;
    featureLocation.textContent = temple.location;
    featureDescription.textContent = temple.description;
    featuredTemple.classList.remove("is-changing");
  };

  if (!reduceMotion && featuredTemple.src && !featuredTemple.src.endsWith(temple.image)) {
    featuredTemple.classList.add("is-changing");
    window.setTimeout(updateFeature, 120);
  } else {
    updateFeature();
  }

  routeItems.forEach((item) => {
    item.classList.toggle("is-active", item.dataset.temple === name);
  });
}

document.body.classList.add("js-ready");
document.documentElement.classList.add("splash-active");

if (introSplash) {
  let splashClosed = false;
  let splashStarted = false;
  let splashTimerId;
  let splashFallbackId;
  const splashWindow = introSplash.querySelector(".splash-window");
  const splashRows = introSplash.querySelectorAll(".splash-row");

  const resetHorizontalScroll = () => {
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    window.scrollTo({ left: 0, top: window.scrollY, behavior: "auto" });
  };

  const fitSplashRows = () => {
    if (!splashRows.length) return;

    splashWindow?.style.removeProperty("--splash-font-size");

    const splashStyles = window.getComputedStyle(splashWindow || introSplash);
    const rowStyles = Array.from(splashRows).map((row) => window.getComputedStyle(row));
    const firstRowFontSize = parseFloat(rowStyles[0].fontSize) || 92;
    const containerWidth = splashWindow?.clientWidth || introSplash.clientWidth || window.innerWidth;
    const containerHeight = splashWindow?.clientHeight || introSplash.clientHeight || window.innerHeight;
    const gap = parseFloat(splashStyles.rowGap) || parseFloat(splashStyles.gap) || 0;
    const verticalPadding =
      (parseFloat(splashStyles.paddingTop) || 0) + (parseFloat(splashStyles.paddingBottom) || 0);
    const fixedVerticalSpace = rowStyles.reduce((total, styles) => {
      return total + (parseFloat(styles.marginTop) || 0) + (parseFloat(styles.marginBottom) || 0);
    }, verticalPadding + gap * Math.max(0, splashRows.length - 1));
    const rowHeight = Array.from(splashRows).reduce((total, row) => {
      return total + row.getBoundingClientRect().height;
    }, 0);
    const availableHeight = Math.max(180, containerHeight - fixedVerticalSpace - 12);
    const heightScale = availableHeight / Math.max(1, rowHeight);

    let widthScale = 1;

    splashRows.forEach((row) => {
      const styles = window.getComputedStyle(row);
      const edge = parseFloat(styles.getPropertyValue("--splash-edge")) || 24;
      const availableWidth = Math.max(180, containerWidth - edge * 2 - 16);

      widthScale = Math.min(widthScale, availableWidth / Math.max(1, row.scrollWidth));
    });

    const splashFontSize = Math.max(16, Math.floor(firstRowFontSize * Math.min(1, widthScale, heightScale)));

    splashWindow?.style.setProperty("--splash-font-size", `${splashFontSize}px`);
  };

  const waitForSplashImages = () => {
    const splashImages = introSplash.querySelectorAll("img");
    const imagePromises = Array.from(splashImages).map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", resolve, { once: true });
      });
    });

    return Promise.all(imagePromises);
  };

  const startIntroSplash = () => {
    if (splashStarted || splashClosed) return;

    splashStarted = true;
    window.clearTimeout(splashFallbackId);
    fitSplashRows();
    introSplash.classList.add("is-ready");
    splashTimerId = window.setTimeout(closeIntroSplash, reduceMotion ? 700 : 5500);
  };

  const closeIntroSplash = () => {
    if (splashClosed) return;

    splashClosed = true;
    window.clearTimeout(splashTimerId);
    window.clearTimeout(splashFallbackId);
    window.removeEventListener("resize", fitSplashRows);
    resetHorizontalScroll();
    introSplash.classList.add("is-leaving");
    document.documentElement.classList.remove("splash-active");
    document.body.classList.remove("splash-active");

    window.setTimeout(() => {
      introSplash.remove();
      resetHorizontalScroll();
    }, reduceMotion ? 80 : 460);
  };

  window.addEventListener("resize", fitSplashRows);
  window.requestAnimationFrame(fitSplashRows);
  Promise.all([document.fonts?.ready || Promise.resolve(), waitForSplashImages()])
    .then(() => {
      window.requestAnimationFrame(startIntroSplash);
    })
    .catch(startIntroSplash);
  splashFallbackId = window.setTimeout(startIntroSplash, 1800);
} else {
  document.documentElement.classList.remove("splash-active");
  document.body.classList.remove("splash-active");
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));

  if (routeMap) {
    const mapObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          routeMap.classList.add("is-visible");
          mapObserver.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    mapObserver.observe(routeMap);
  }
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
  routeMap?.classList.add("is-visible");
}

function getBlueprintProgress() {
  if (!blueprintSection) return 0;

  const sectionTop = window.scrollY + blueprintSection.getBoundingClientRect().top;
  const scrollableDistance = Math.max(1, blueprintSection.offsetHeight - window.innerHeight);
  const scrollPosition = window.scrollY - sectionTop;

  return Math.min(1, Math.max(0, scrollPosition / scrollableDistance));
}

function setBlueprintScrollTrack() {
  if (!blueprintSection || !blueprintCards.length) return;

  const panelCount = blueprintCards.length;
  const scrollScreens = Math.max(3.6, panelCount * 0.82);

  blueprintSection.style.setProperty("--blueprint-panel-count", panelCount);
  blueprintSection.style.setProperty("--blueprint-scroll-height", `${window.innerHeight * scrollScreens}px`);
}

function updateBlueprintScene() {
  if (!blueprintSection || !blueprintCards.length) return;

  setBlueprintScrollTrack();

  const sectionTop = window.scrollY + blueprintSection.getBoundingClientRect().top;
  const scrollableDistance = Math.max(1, blueprintSection.offsetHeight - window.innerHeight);
  const scrollPosition = window.scrollY - sectionTop;
  const isDesktop = window.matchMedia("(min-width: 901px)").matches;
  const progress = getBlueprintProgress();
  const lastIndex = blueprintCards.length - 1;
  const scrollIndex = progress * lastIndex;
  const activeIndex = Math.min(lastIndex, Math.max(0, Math.round(scrollIndex)));

  if (blueprintStage) {
    blueprintSection.classList.toggle("is-pinned", isDesktop && scrollPosition >= 0 && scrollPosition <= scrollableDistance);
    blueprintSection.classList.toggle("is-past", isDesktop && scrollPosition > scrollableDistance);
  }

  blueprintSection.style.setProperty("--blueprint-progress", progress.toFixed(3));

  blueprintSteps.forEach((step, index) => {
    const isActive = index === activeIndex;

    step.classList.toggle("active", isActive);

    if (isActive) {
      step.setAttribute("aria-current", "step");
    } else {
      step.removeAttribute("aria-current");
    }
  });

  blueprintCards.forEach((card, index) => {
    const distance = index - scrollIndex;
    const absDistance = Math.abs(distance);
    const isPast = distance < 0;
    const x = reduceMotion ? 0 : distance * 86 + (isPast ? -44 : 0);
    const y = reduceMotion ? 0 : distance * -28 + (isPast ? 36 : 0);
    const z = reduceMotion ? 0 : absDistance * -118;
    const scale = reduceMotion ? 1 : Math.max(0.7, 1 - absDistance * 0.07);
    const opacity = Math.max(0.18, 1 - absDistance * 0.14);
    const rotX = reduceMotion ? 0 : 8 + Math.min(absDistance, 3) * 1.4;
    const rotY = reduceMotion ? 0 : -23 + distance * 3.6;
    const rotZ = reduceMotion ? 0 : -1.2 + distance * 0.42;

    card.classList.toggle("active", index === activeIndex);
    card.style.setProperty("--x", `${x.toFixed(2)}px`);
    card.style.setProperty("--y", `${y.toFixed(2)}px`);
    card.style.setProperty("--z", `${z.toFixed(2)}px`);
    card.style.setProperty("--rot-x", `${rotX.toFixed(2)}deg`);
    card.style.setProperty("--rot-y", `${rotY.toFixed(2)}deg`);
    card.style.setProperty("--rot-z", `${rotZ.toFixed(2)}deg`);
    card.style.setProperty("--scale", scale.toFixed(3));
    card.style.setProperty("--opacity", opacity.toFixed(3));
    card.style.zIndex = String(100 - Math.round(absDistance * 10));
  });
}

function scrollToBlueprintStep(index) {
  if (!blueprintSection || blueprintCards.length < 2) return;

  setBlueprintScrollTrack();

  const sectionTop = window.scrollY + blueprintSection.getBoundingClientRect().top;
  const scrollableDistance = Math.max(1, blueprintSection.offsetHeight - window.innerHeight);
  const progress = index / (blueprintCards.length - 1);

  window.scrollTo({
    top: sectionTop + scrollableDistance * progress,
    behavior: reduceMotion ? "auto" : "smooth"
  });
}

window.addEventListener("scroll", updateBlueprintScene, { passive: true });
window.addEventListener("resize", updateBlueprintScene);
updateBlueprintScene();

blueprintSteps.forEach((step) => {
  const stepIndex = Number(step.dataset.blueprintStep);

  step.addEventListener("click", () => scrollToBlueprintStep(stepIndex));
  step.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      scrollToBlueprintStep(stepIndex);
    }
  });
});

routeItems.forEach((item) => {
  item.addEventListener("mouseenter", () => setTemple(item.dataset.temple));
  item.addEventListener("focus", () => setTemple(item.dataset.temple));
  item.addEventListener("click", () => setTemple(item.dataset.temple));
});

setTemple("Tongdosa");
